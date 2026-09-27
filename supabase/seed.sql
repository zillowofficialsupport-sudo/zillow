insert into public.listings (
  owner_id, title, address, city, state, zipcode, listing_type, building_type,
  est_payment, price, price_sqft, bedroom, bathroom, sqft, built_in,
  heating, ac, garage, overview, key_words, lat, lng
)
select
  null, sample.title, sample.address, sample.city, sample.state, sample.zipcode,
  sample.listing_type, sample.building_type, sample.est_payment, sample.price,
  sample.price_sqft, sample.bedroom, sample.bathroom, sample.sqft, sample.built_in,
  true, true, sample.garage, sample.overview, sample.key_words, sample.lat, sample.lng
from (values
  ('Sunny Chelsea Apartment', '125 W 18th St', 'New York', 'NY', '10011', 'Sale', 'Apartment', '$4,200/month', 850000, 708.33, 2, 1, 1200, 2015, false, 'Bright two-bedroom home with a renovated kitchen and open city views.', 'CHELSEA UPDATED KITCHEN NATURAL LIGHT', 40.7396, -73.9963),
  ('Greenpoint Loft Rental', '18 Bedford Ave', 'Brooklyn', 'NY', '11222', 'Rent', 'Loft', '$3,200/month', 3200, 4.57, 1, 1, 700, 2012, false, 'Modern loft near the waterfront, neighborhood cafes, and subway connections.', 'BROOKLYN LOFT WATERFRONT SUBWAY', 40.7192, -73.9573),
  ('Long Island City Condo', '44-10 23rd St', 'Long Island City', 'NY', '11101', 'Sale', 'Condo', '$4,900/month', 975000, 590.91, 3, 2, 1650, 2018, true, 'Three-bedroom condo with a doorman, gym access, and East River views.', 'LONG ISLAND CITY DOORMAN GYM EAST RIVER', 40.7447, -73.9469),
  ('Upper West Side Two Bedroom', '101 W 87th St', 'New York', 'NY', '10024', 'Rent', 'Apartment', '$4,100/month', 4100, 4.18, 2, 2, 980, 1998, false, 'Spacious rental close to Central Park and convenient subway access.', 'UPPER WEST SIDE CENTRAL PARK SUBWAY', 40.7894, -73.9729),
  ('Downtown Brooklyn Townhouse', '2 Gold St', 'Brooklyn', 'NY', '11201', 'Sale', 'Townhouse', '$3,900/month', 760000, 562.96, 2, 2, 1350, 2006, true, 'Contemporary townhouse near downtown Brooklyn and the waterfront.', 'BROOKLYN TOWNHOUSE WATERFRONT DOWNTOWN', 40.7021, -73.9877)
) as sample(title, address, city, state, zipcode, listing_type, building_type, est_payment, price, price_sqft, bedroom, bathroom, sqft, built_in, garage, overview, key_words, lat, lng)
where not exists (
  select 1 from public.listings existing where existing.address = sample.address and existing.city = sample.city
);
