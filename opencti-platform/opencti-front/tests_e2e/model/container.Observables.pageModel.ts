// eslint-disable-next-line import/no-extraneous-dependencies
import { Page } from '@playwright/test';

export default class ContainerObservablesPage {
  constructor(private page: Page) {
  }

  getContainerObservablesPage() {
    return this.page.getByTestId('container-observables-pages');
  }
}
