import { ClientStrakkPage } from './app.po';

describe('client-strakk App', function() {
  let page: ClientStrakkPage;

  beforeEach(() => {
    page = new ClientStrakkPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
