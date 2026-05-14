(function () {
  const dataEl = document.getElementById('sale-shop-data');
  const banner = document.getElementById('sale-banner');
  const modal = document.getElementById('sale-claim-modal');
  const emptyState = document.querySelector('[data-empty-state]');
  const grid = document.querySelector('[data-sale-grid]');

  if (!dataEl || !banner || !modal || !emptyState || !grid) {
    return;
  }

  const state = JSON.parse(dataEl.textContent || '{}');
  const cards = Array.from(document.querySelectorAll('[data-sale-card]'));
  const categoryButtons = Array.from(document.querySelectorAll('[data-category-filter]'));
  const pickupButtons = Array.from(document.querySelectorAll('[data-pickup-filter]'));
  const availabilityButton = document.querySelector('[data-availability-filter]');

  const claimTitle = document.getElementById('sale-claim-title');
  const claimSummary = document.getElementById('sale-claim-summary');
  const claimImage = document.getElementById('sale-claim-image');
  const claimName = document.getElementById('sale-claim-name');
  const claimEmail = document.getElementById('sale-claim-email');
  const claimNote = document.getElementById('sale-claim-note');
  const claimSubmit = document.getElementById('sale-claim-submit');
  const claimVenmo = document.getElementById('sale-claim-venmo');

  const filters = {
    category: 'All',
    pickup: 'All',
    availableOnly: true,
  };

  let activeListing = null;

  function showBanner(message, isError) {
    banner.textContent = message;
    banner.classList.add('is-visible');
    banner.classList.toggle('is-error', Boolean(isError));
  }

  function clearBanner() {
    banner.textContent = '';
    banner.classList.remove('is-visible', 'is-error');
  }

  function isMobile() {
    return window.matchMedia('(max-width: 640px)').matches;
  }

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesCategory =
        filters.category === 'All' || card.dataset.category === filters.category;
      const matchesPickup =
        filters.pickup === 'All' || card.dataset.pickup === filters.pickup;
      const matchesAvailability =
        !filters.availableOnly || card.dataset.status === 'available';

      const visible = matchesCategory && matchesPickup && matchesAvailability;
      card.classList.toggle('is-hidden', !visible);

      if (visible) {
        visibleCount += 1;
      }
    });

    emptyState.hidden = visibleCount !== 0;
  }

  function setChipState(buttons, activeValue, attributeName) {
    buttons.forEach((button) => {
      button.classList.toggle('is-active', button.getAttribute(attributeName) === activeValue);
    });
  }

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filters.category = button.getAttribute('data-category-filter') || 'All';
      setChipState(categoryButtons, filters.category, 'data-category-filter');
      applyFilters();
    });
  });

  pickupButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextValue = button.getAttribute('data-pickup-filter') || 'All';
      filters.pickup = filters.pickup === nextValue ? 'All' : nextValue;
      pickupButtons.forEach((pickupButton) => {
        pickupButton.classList.toggle(
          'is-active',
          pickupButton.getAttribute('data-pickup-filter') === filters.pickup,
        );
      });
      applyFilters();
    });
  });

  if (availabilityButton) {
    availabilityButton.addEventListener('click', () => {
      filters.availableOnly = !filters.availableOnly;
      availabilityButton.classList.toggle('is-active', filters.availableOnly);
      availabilityButton.textContent = filters.availableOnly ? 'Available only' : 'Show all';
      applyFilters();
    });
  }

  function closeModal() {
    modal.hidden = true;
    activeListing = null;
  }

  function openModal(listing) {
    activeListing = listing;
    claimTitle.textContent = `Claim ${listing.name}`;
    claimSummary.textContent = `${listing.category} · $${(listing.priceCents / 100).toFixed(
      listing.priceCents % 100 === 0 ? 0 : 2,
    )}`;
    claimName.value = '';
    claimEmail.value = '';
    claimNote.value = '';

    if (listing.imageUrl) {
      claimImage.src = listing.imageUrl;
      claimImage.alt = listing.name;
      claimImage.hidden = false;
    } else {
      claimImage.hidden = true;
    }

    claimSubmit.hidden = isMobile() && Boolean(state.venmoHandle);
    claimVenmo.hidden = !(isMobile() && state.venmoHandle);
    modal.hidden = false;
  }

  function markClaimed(listingId) {
    const card = document.querySelector(`[data-listing-id="${listingId}"]`);

    if (!card) {
      return;
    }

    card.dataset.status = 'claimed';
    const claimButton = card.querySelector('[data-claim-button]');

    if (claimButton) {
      claimButton.remove();
    }

    const tagRow = card.querySelector('.sale-tag-row');

    if (tagRow && !tagRow.textContent.includes('Unavailable')) {
      const tag = document.createElement('span');
      tag.className = 'sale-tag';
      tag.textContent = 'Unavailable';
      tagRow.appendChild(tag);
    }

    applyFilters();
  }

  async function submitClaim(paymentMode) {
    clearBanner();

    if (!activeListing) {
      return;
    }

    if (!claimName.value.trim() || !claimEmail.value.trim()) {
      showBanner('Name and email are required.', true);
      return;
    }

    claimSubmit.disabled = true;
    claimVenmo.disabled = true;

    try {
      const response = await fetch(`/api/sale/${state.saleSlug}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: activeListing.id,
          buyerName: claimName.value,
          buyerEmail: claimEmail.value,
          buyerNote: claimNote.value,
          paymentMode,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || 'Unable to claim this item right now.');
      }

      markClaimed(activeListing.id);
      closeModal();
      showBanner(payload.message, false);

      if (paymentMode === 'venmo_now' && state.venmoHandle) {
        const amount = (activeListing.priceCents / 100).toFixed(
          activeListing.priceCents % 100 === 0 ? 0 : 2,
        );
        const venmoUrl =
          `venmo://paycharge?txn=pay&recipients=${encodeURIComponent(state.venmoHandle)}` +
          `&amount=${encodeURIComponent(amount)}` +
          `&note=${encodeURIComponent(`${activeListing.name} - moving sale`)}`;

        window.location.assign(venmoUrl);
      }
    } catch (error) {
      showBanner(error instanceof Error ? error.message : 'Unable to claim this item.', true);
    } finally {
      claimSubmit.disabled = false;
      claimVenmo.disabled = false;
    }
  }

  document.querySelectorAll('[data-claim-button]').forEach((button) => {
    button.addEventListener('click', () => {
      const listingId = button.getAttribute('data-listing-id');
      const listing = state.listings.find((entry) => entry.id === listingId);

      if (listing) {
        openModal(listing);
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  claimSubmit.addEventListener('click', () => submitClaim('pay_later'));
  claimVenmo.addEventListener('click', () => submitClaim('venmo_now'));

  applyFilters();
})();
