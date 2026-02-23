import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockResponse = {
    token: 'mock-jwt-token',
    user: { _id: '1', name: 'Test User', email: 'test@example.com', role: 'user' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    service.login('test@example.com', 'Pass@1234').subscribe(res => {
      expect(res.token).toBe('mock-jwt-token');
      expect(localStorage.getItem('ma_token')).toBe('mock-jwt-token');
    });

    const req = httpMock.expectOne('http://localhost:5000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register user and store token', () => {
    service.register({ name: 'Test', email: 'test@example.com', password: 'Pass@1234' }).subscribe(res => {
      expect(res.user.name).toBe('Test User');
    });

    const req = httpMock.expectOne('http://localhost:5000/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should return false for isLoggedIn when no token', () => {
    expect(service.isLoggedIn).toBeFalse();
  });

  it('should return true for isLoggedIn after login', () => {
    localStorage.setItem('ma_token', 'test-token');
    expect(service.isLoggedIn).toBeTrue();
  });

  it('should clear token on logout', () => {
    localStorage.setItem('ma_token', 'test-token');
    service.logout();
    expect(localStorage.getItem('ma_token')).toBeNull();
  });
});
