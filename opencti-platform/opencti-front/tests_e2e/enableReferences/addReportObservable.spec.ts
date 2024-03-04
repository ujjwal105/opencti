import { expect, test } from '../fixtures/baseFixtures';
import ReportPage from '../model/report.pageModel';
import ContainerObservablesPage from '../model/container.Observables.pageModel';
import ReportDetailsPage from '../model/reportDetails.pageModel';
import ReportFormPage from '../model/reportForm.pageModel';

test('Add and remove observable from Observables tab of a Report', async ({ page }) => {
  const reportPage = new ReportPage(page);
  const reportDetailsPage = new ReportDetailsPage(page);
  const reportForm = new ReportFormPage(page);
  const containerObservablesPage = new ContainerObservablesPage(page);

  // Create a report and check that adding an observable is possible
  await page.goto('/dashboard/analyses/reports');
  await reportPage.addNewReport();
  await reportForm.fillNameInput('Test add observable e2e');
  await reportPage.getCreateReportButton().click();
  await reportPage.getItemFromList('Test add observable e2e').click();
  await expect(reportDetailsPage.getReportDetailsPage()).toBeVisible();
  await page.getByRole('tab', { name: 'Observables' }).click();
  await expect(containerObservablesPage.getContainerObservablesPage()).toBeVisible();
  await page.getByLabel('Add', { exact: true }).click();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('button', { name: 'IPV4 address' }).click();
  await page.getByLabel('value').click();
  await page.getByLabel('value').fill('8.8.8.8');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('button', { name: 'IPv4 address 8.8.8.8' })).toBeVisible();
  await page.getByRole('button', { name: 'IPv4 address 8.8.8.8' }).click();
  await page.getByLabel('Close').click();
  await expect(page.getByRole('link', { name: 'IPv4 address 8.8.8.8' })).toBeVisible();

  // Enable report references and check that removing observable is still possible as admin user
  await page.goto('/dashboard/settings/customization/entity_types');
  await page.getByRole('link', { name: 'Report' }).click();
  await page.locator('span').filter({ hasText: 'Enforce references' }).click();
  await page.goto('/dashboard/analyses/reports');
  await reportPage.getItemFromList('Test add observable e2e').click();
  await page.getByRole('tab', { name: 'Observables' }).click();
  await expect(containerObservablesPage.getContainerObservablesPage()).toBeVisible();
  await page.getByLabel('Add', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'IPv4 address 8.8.8.8' })).toBeVisible();
  await page.getByRole('button', { name: 'IPv4 address 8.8.8.8' }).click();
  await page.getByLabel('Close').click();
  await expect(page.getByRole('link', { name: 'IPv4 address 8.8.8.8' })).toBeHidden();

  // Clean up report "enable references" configuration
  await page.goto('/dashboard/settings/customization/entity_types');
  await page.getByRole('link', { name: 'Report' }).click();
  await page.locator('span').filter({ hasText: 'Enforce references' }).click();
});
