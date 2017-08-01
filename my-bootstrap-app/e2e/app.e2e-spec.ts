import { MyBootstrapAppPage } from './app.po';

describe('my-bootstrap-app App', () => {
  let page: MyBootstrapAppPage;

  beforeEach(() => {
    page = new MyBootstrapAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
