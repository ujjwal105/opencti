// eslint-disable-next-line import/no-extraneous-dependencies
import { Page } from '@playwright/test';

export default class RulesSettingsPage {
  constructor(private page: Page) {}

  getSettingsPage() {
    return this.page.getByTestId('rules-settings-page');
  }

  getAddRuleButton() {
    return this.page.getByLabel('Add');
  }

  getRuleInList(ruleName: string) {
    return this.page.getByRole('link', { name: ruleName });
  }
}
