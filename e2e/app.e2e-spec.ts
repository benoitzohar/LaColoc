import { LacolocPage } from './app.po';

describe('lacoloc App', () => {
  let page: LacolocPage;

  beforeEach(() => {
    page = new LacolocPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
