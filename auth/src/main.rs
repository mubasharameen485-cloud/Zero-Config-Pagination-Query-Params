use don_core::{DonServer, DonHooks, axum::Router};
use don_macros::DonModel;
use serde::{Deserialize, Serialize};

// ==========================================
// 1. Define your Database Model
// ==========================================
#[derive(Debug, Clone, Serialize, Deserialize, don_core::sqlx::FromRow, DonModel)]
pub struct Product {
    pub id: i32, 
    pub name: String,
    pub price: i32,
}

// ==========================================
// 2. Optional: Lifecycle Hooks
// ==========================================
impl DonHooks for Product {
    async fn before_save(&mut self) -> Result<(), String> {
        self.name = self.name.trim().to_uppercase();
        Ok(()) 
    }
}

// ==========================================
// 3. Start the Server
// ==========================================
#[tokio::main]
async fn main() {
    // Load environment variables (.env)
    dotenvy::dotenv().ok();
    println!("Starting Don Framework with Pagination...");

    // Mount the auto-generated CRUD routes
    let api_routes = Router::new()
        .nest("/api/products", Product::get_api_routes());

    // Start the Don Server
    DonServer::new()
        .port(8080)
        .with_routes(api_routes)
        .start()
        .await
        .expect("Server crashed!");
}