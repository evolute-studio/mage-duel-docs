# Shop

This document provides reference for the Shop model used for in-game item purchasing in Mage Duel.

## Overview

The Shop model represents the in-game marketplace where players can purchase skins using their balance.

---

## Shop Model

### Structure Definition

```rust
#[derive(Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Shop {
    #[key]
    pub shop_id: felt252,
    pub skin_prices: Array<u32>,
}
```

### Field Documentation

#### Primary Key
- **`shop_id: felt252`**
  - Unique identifier for the shop
  - Primary key for database queries

#### Item Catalog
- **`skin_prices: Array<u32>`**
  - Array containing prices for different skins
  - Array index corresponds to skin ID
  - Prices stored as `u32` values in game currency
  - Price of `0` indicates free/default item

---

## Usage Patterns

### Reading Shop Data

```rust
// Get shop information
let shop: Shop = world.read_model(shop_id);

// Check price of specific skin
fn get_skin_price(skin_id: u8, shop: @Shop) -> Option<u32> {
    if skin_id.into() < shop.skin_prices.len() {
        Option::Some(*shop.skin_prices.at(skin_id.into()))
    } else {
        Option::None
    }
}
```

### Purchase Validation

```rust
// Check if player can afford a skin
fn can_afford_skin(player: @Player, skin_id: u8, shop: @Shop) -> bool {
    match get_skin_price(skin_id, shop) {
        Option::Some(price) => player.balance >= price,
        Option::None => false,
    }
}
```

### Purchase Transaction

```rust
// Execute skin purchase
fn purchase_skin(
    player_address: ContractAddress,
    skin_id: u8,
    shop_id: felt252,
    mut world: WorldStorage
) {
    let shop: Shop = world.read_model(shop_id);
    let mut player: Player = world.read_model(player_address);
    
    let price = get_skin_price(skin_id, @shop).unwrap();
    
    // Deduct balance
    player.balance -= price;
    
    // Update player
    world.write_model(@player);
}
```

---

## Shop Management

### Update Prices

```rust
// Update skin prices
fn update_skin_prices(
    shop_id: felt252,
    new_prices: Array<u32>,
    mut world: WorldStorage
) {
    let mut shop: Shop = world.read_model(shop_id);
    shop.skin_prices = new_prices;
    world.write_model(@shop);
}
```

### Add New Skin

```rust
// Add new skin to shop
fn add_skin_to_shop(
    shop_id: felt252,
    skin_price: u32,
    mut world: WorldStorage
) {
    let mut shop: Shop = world.read_model(shop_id);
    shop.skin_prices.append(skin_price);
    world.write_model(@shop);
}
```
---
