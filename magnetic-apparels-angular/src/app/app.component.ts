import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="shell">
      <header class="shell-header">
        <div class="logo">🧲 Magnetic Apparels</div>
        <nav class="nav-links">
          <a href="http://localhost:5173/login" class="nav-link">Login / Register</a>
          <a href="http://localhost:3000" class="nav-link">Dashboard</a>
          <a href="http://localhost:5173/cart" class="nav-link">Cart</a>
          <a href="http://localhost:5173/payment" class="nav-link">Payment</a>
        </nav>
        <div class="user-info" *ngIf="authService.isLoggedIn">
          <span>Welcome, {{ authService.currentUser?.name }}</span>
          <button (click)="logout()" class="btn-logout">Logout</button>
        </div>
      </header>

      <div class="shell-body">
        <div class="info-card">
          <h2>🧲 Magnetic Apparels — App Shell</h2>
          <p>This Angular app serves as the <strong>shared authentication layer</strong> and micro-frontend shell.</p>
          <div class="app-grid">
            <a href="http://localhost:5173/login" class="app-card">
              <span class="app-icon">🔐</span>
              <h3>Login / Register</h3>
              <p>Vue App · Port 5173</p>
            </a>
            <a href="http://localhost:3000" class="app-card">
              <span class="app-icon">🛍</span>
              <h3>Products Dashboard</h3>
              <p>React App · Port 3000</p>
            </a>
            <a href="http://localhost:5173/cart" class="app-card">
              <span class="app-icon">🛒</span>
              <h3>Cart & Payment</h3>
              <p>Vue App · Port 5173</p>
            </a>
            <a href="http://localhost:5000/health" class="app-card" target="_blank">
              <span class="app-icon">⚙️</span>
              <h3>API Health Check</h3>
              <p>Node API · Port 5000</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shell { min-height: 100vh; font-family: 'DM Sans', sans-serif; background: #f8f5ff; }
    .shell-header { background: #fff; padding: 1rem 2rem; display: flex; align-items: center; gap: 2rem; box-shadow: 0 2px 10px rgba(124,77,255,0.08); flex-wrap: wrap; }
    .logo { font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; color: #7c4dff; font-weight: 700; }
    .nav-links { display: flex; gap: 1rem; flex: 1; }
    .nav-link { color: #555; font-size: 0.9rem; padding: 0.4rem 0.75rem; border-radius: 6px; transition: all 0.2s; }
    .nav-link:hover { background: #f5f0ff; color: #7c4dff; }
    .user-info { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: #555; }
    .btn-logout { background: none; border: 1px solid #ddd; padding: 0.4rem 0.875rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
    .btn-logout:hover { border-color: #ff4757; color: #ff4757; }
    .shell-body { max-width: 900px; margin: 3rem auto; padding: 0 1rem; }
    .info-card { background: #fff; border-radius: 20px; padding: 2.5rem; box-shadow: 0 4px 20px rgba(124,77,255,0.08); }
    .info-card h2 { font-family: Georgia, serif; font-size: 1.6rem; margin-bottom: 0.75rem; color: #7c4dff; }
    .info-card > p { color: #666; margin-bottom: 2rem; line-height: 1.6; }
    .app-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
    .app-card { background: #f8f5ff; border: 2px solid #ede8ff; border-radius: 14px; padding: 1.5rem 1rem; text-align: center; cursor: pointer; transition: all 0.2s; display: block; }
    .app-card:hover { border-color: #7c4dff; background: #fff; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(124,77,255,0.12); }
    .app-icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
    .app-card h3 { font-size: 0.95rem; color: #333; margin-bottom: 0.25rem; }
    .app-card p { font-size: 0.78rem; color: #888; }
  `]
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
  }
}
