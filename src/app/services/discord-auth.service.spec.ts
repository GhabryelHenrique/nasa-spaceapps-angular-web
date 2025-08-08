import { TestBed } from '@angular/core/testing';

import { DiscordAuthService } from './discord-auth.service';

describe('DiscordAuthService', () => {
  let service: DiscordAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscordAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
