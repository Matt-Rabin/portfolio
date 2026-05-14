create extension if not exists pgcrypto;

create table if not exists public.sale_listings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price_cents integer not null check (price_cents >= 0),
  condition text not null,
  description text not null default '',
  pickup_window text not null,
  image_url text,
  product_url text,
  status text not null default 'available' check (status in ('available', 'claimed', 'sold', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sale_claims (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.sale_listings(id) on delete cascade,
  buyer_name text not null,
  buyer_email text not null,
  buyer_note text,
  payment_mode text not null check (payment_mode in ('venmo_now', 'pay_later')),
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists sale_listings_touch_updated_at on public.sale_listings;

create trigger sale_listings_touch_updated_at
before update on public.sale_listings
for each row
execute procedure public.touch_updated_at();

create or replace function public.claim_sale_listing(
  p_listing_id uuid,
  p_buyer_name text,
  p_buyer_email text,
  p_buyer_note text,
  p_payment_mode text
)
returns setof public.sale_listings
language plpgsql
security definer
as $$
declare
  claimed_row public.sale_listings%rowtype;
begin
  update public.sale_listings
  set status = 'claimed'
  where id = p_listing_id
    and status = 'available'
  returning * into claimed_row;

  if claimed_row.id is null then
    raise exception 'listing_unavailable' using errcode = 'P0001';
  end if;

  insert into public.sale_claims (listing_id, buyer_name, buyer_email, buyer_note, payment_mode)
  values (claimed_row.id, p_buyer_name, p_buyer_email, p_buyer_note, p_payment_mode);

  return query
  select *
  from public.sale_listings
  where id = claimed_row.id;
end;
$$;
