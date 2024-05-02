import { Page } from '@playwright/test';
import { expect } from '../../fixtures/baseFixtures';

export default class LeftBarPage {
  constructor(private page:Page) {}

  open() {
    return this.page.getByTestId('ChevronRightIcon').click();
  }

  async clickOnMenu(menuName: string, subMenuItem?: string) {
    await this.page.getByRole('menuitem', { name: menuName, exact: true }).click();
    if (subMenuItem) {
      await this.page.getByRole('menuitem', { name: subMenuItem }).click();
    }
  }

  async expectPage(menuName: string, pageName: string) {
    await this.page.getByRole('menuitem', { name: pageName, exact: true }).click();
    await expect(this.page.getByText(`${menuName}/${pageName}`)).toBeVisible();
  }
}
