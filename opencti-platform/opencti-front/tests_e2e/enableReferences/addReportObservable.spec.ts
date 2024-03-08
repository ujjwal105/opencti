import { expect, test } from '../fixtures/baseFixtures';
import ReportPage from '../model/report.pageModel';
import ContainerObservablesPage from '../model/containerObservables.pageModel';
import ReportDetailsPage from '../model/reportDetails.pageModel';
import ReportFormPage from '../model/reportForm.pageModel';
import LoginPage from '../model/login.pageModel';
import TopMenuProfilePage from '../model/menu/topMenuProfile.pageModel';
import DashboardPage from '../model/dashboard.pageModel';
import CommitMessagePage from '../model/commitMessage.pageModel';
import ContainerAddObservablesPage from '../model/containerAddObservables.pageModel';
import RulesSettingsPage from '../model/rulesSettings.pageModel';
import RuleFormPage from '../model/ruleForm.pageModel';
import RulePage from '../model/rule.pageModel';
import GroupsSettingsPage from '../model/groupsSettings.pageModel';
import GroupPage from '../model/group.pageModel';
import GroupFormPage from '../model/groupForm.pageModel';
import UsersSettingsPage from '../model/usersSettings.pageModel';
import UserPage from '../model/user.pageModel';
import UserFormPage from '../model/userForm.pageModel';

const noBypassUserAuthFile = 'tests_e2e/.setup/.auth/no-bypass-ref-user.json';
const noBypassUserLogin = 'noBypassReferences@user.test';
const noBypassUserPassword = 'qwerty123';
const noBypassUserName = 'NoBypassReferencesUser';
const noBypassRuleName = 'NoBypassReferencesRule';
const noBypassGroupName = 'NoBypassReferencesTestGroup';

test.describe('Create and authenticate user with no references bypass capabilities', () => {
  test('Create basic user role', async ({ page }) => {
    const rulesSettingsPage = new RulesSettingsPage(page);
    const rulePage = new RulePage(page);
    const ruleFormPage = new RuleFormPage(page);

    await page.goto('/dashboard/settings/accesses/roles');
    await expect(rulesSettingsPage.getSettingsPage()).toBeVisible();
    await rulesSettingsPage.getAddRuleButton().click();
    await ruleFormPage.fillNameInput(noBypassRuleName);
    await ruleFormPage.getCreateButton().click();
    await expect(rulesSettingsPage.getRuleInList(noBypassRuleName)).toBeVisible();
    await rulesSettingsPage.getRuleInList(noBypassRuleName).click();
    await rulePage.getEditButton().click();
    await ruleFormPage.getCapabilitiesTab().click();
    await ruleFormPage.getAccessKnowledgeCheckbox().click();
    await expect(ruleFormPage.getAccessKnowledgeCheckbox()).toBeChecked();
    await ruleFormPage.getCreateUpdateKnowledgeCheckbox().click();
    await expect(ruleFormPage.getCreateUpdateKnowledgeCheckbox()).toBeChecked();
    await ruleFormPage.getAccessAdministrationCheckbox().click();
    await expect(ruleFormPage.getAccessAdministrationCheckbox()).toBeChecked();
  });

  test('Create basic user group', async ({ page }) => {
    const groupsSettingsPage = new GroupsSettingsPage(page);
    const groupPage = new GroupPage(page);
    const groupFormPage = new GroupFormPage(page);

    await page.goto('/dashboard/settings/accesses/groups');
    await expect(groupsSettingsPage.getSettingsPage()).toBeVisible();
    await groupsSettingsPage.getAddGroupButton().click();
    await groupFormPage.fillNameInput(noBypassGroupName);
    await groupFormPage.getCreateButton().click();
    await expect(groupsSettingsPage.getGroupInList(noBypassGroupName)).toBeVisible();
    await groupsSettingsPage.getGroupInList(noBypassGroupName).click();
    await groupPage.getEditButton().click();
    await groupFormPage.getRolesTab().click();
    await groupFormPage.getSpecificRuleCheckbox(noBypassRuleName).click();
    await expect(groupFormPage.getSpecificRuleCheckbox(noBypassRuleName)).toBeChecked();
  });

  test('Create basic user', async ({ page }) => {
    const usersSettingsPage = new UsersSettingsPage(page);
    const userPage = new UserPage(page);
    const userFormPage = new UserFormPage(page);

    await page.goto('/dashboard/settings/accesses/users');
    await expect(usersSettingsPage.getSettingsPage()).toBeVisible();
    await usersSettingsPage.getAddUserButton().click();
    await userFormPage.fillNameInput(noBypassUserName);
    await userFormPage.fillEmailInput(noBypassUserLogin);
    await userFormPage.fillPasswordInput(noBypassUserPassword);
    await userFormPage.fillPasswordConfirmationInput(noBypassUserPassword);
    await userFormPage.getCreateButton().click();
    await expect(usersSettingsPage.getUserInList(noBypassUserName)).toBeVisible();
    await usersSettingsPage.getUserInList(noBypassUserName).click();
    await userPage.getEditButton().click();
    await userFormPage.getGroupsTab().click();
    await userFormPage.getSpecificGroupCheckbox(noBypassGroupName).click();
    await expect(userFormPage.getSpecificGroupCheckbox(noBypassGroupName)).toBeChecked();
    await userFormPage.getSpecificGroupCheckbox('Default (Max Confidence').click();
    await expect(userFormPage.getSpecificGroupCheckbox('Default (Max Confidence')).not.toBeChecked();
  });

  test('Authenticate basic user', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);
    const topMenu = new TopMenuProfilePage(page);
    await page.goto('/');
    await topMenu.logout();
    await expect(loginPage.getPage()).toBeVisible();
    await loginPage.fillLoginInput(noBypassUserLogin);
    await loginPage.fillPasswordInput(noBypassUserPassword);
    await loginPage.getSignInButton().click();
    await expect(dashboardPage.getPage()).toBeVisible();
    await page.context().storageState({ path: noBypassUserAuthFile });
  });
});

test('Add and remove observable from Observables tab of a Report as Admin user', async ({ page }) => {
  const reportPage = new ReportPage(page);
  const reportDetailsPage = new ReportDetailsPage(page);
  const reportForm = new ReportFormPage(page);
  const containerObservablesPage = new ContainerObservablesPage(page);
  const containerAddObservablesPage = new ContainerAddObservablesPage(page);

  // Create a report and check that adding an observable is possible
  await page.goto('/dashboard/analyses/reports');
  await reportPage.addNewReport();
  await reportForm.fillNameInput('Test add observable e2e');
  await reportPage.getCreateReportButton().click();
  await reportPage.getItemFromList('Test add observable e2e').click();
  await expect(reportDetailsPage.getReportDetailsPage()).toBeVisible();
  await reportDetailsPage.getObservablesTab().click();
  await expect(containerObservablesPage.getContainerObservablesPage()).toBeVisible();
  await containerObservablesPage.getAddObservableListButton().click();
  await containerAddObservablesPage.createNewIPV4Observable('8.8.8.8');
  await expect(containerAddObservablesPage.getObservable('IPv4 address 8.8.8.8')).toBeVisible();
  await containerAddObservablesPage.getObservable('IPv4 address 8.8.8.8').click();
  await containerAddObservablesPage.getCloseObservablesListButton().click();
  await expect(containerObservablesPage.getObservableInContainer('IPv4 address 8.8.8.8')).toBeVisible();

  // Enable report references and check that removing observable is still possible as admin user
  await page.goto('/dashboard/settings/customization/entity_types');
  await page.getByRole('link', { name: 'Report' }).click();
  await page.locator('span').filter({ hasText: 'Enforce references' }).click();

  await page.goto('/dashboard/analyses/reports');
  await reportPage.getItemFromList('Test add observable e2e').click();
  await reportDetailsPage.getObservablesTab().click();
  await expect(containerObservablesPage.getContainerObservablesPage()).toBeVisible();
  await containerObservablesPage.getAddObservableListButton().click();
  await expect(containerAddObservablesPage.getObservable('IPv4 address 8.8.8.8')).toBeVisible();
  await containerAddObservablesPage.getObservable('IPv4 address 8.8.8.8').click();
  await containerAddObservablesPage.getCloseObservablesListButton().click();
  await expect(containerObservablesPage.getObservableInContainer('IPv4 address 8.8.8.8')).toBeHidden();

  // Clean up report "enable references" configuration
  await page.goto('/dashboard/settings/customization/entity_types');
  await page.getByRole('link', { name: 'Report' }).click();
  await page.locator('span').filter({ hasText: 'Enforce references' }).click();
});

test.describe('Add and remove observable from Observables tab of a Report as noBypass user', () => {
  test.use({ storageState: noBypassUserAuthFile });
  test('Run test as noBypass user', async ({ page }) => {
    const reportPage = new ReportPage(page);
    const reportDetailsPage = new ReportDetailsPage(page);
    const reportForm = new ReportFormPage(page);
    const containerObservablesPage = new ContainerObservablesPage(page);
    const containerAddObservablesPage = new ContainerAddObservablesPage(page);
    const commitMessagePage = new CommitMessagePage(page);

    // Create a report and check that adding an observable is possible
    await page.goto('/dashboard/analyses/reports');
    await reportPage.addNewReport();
    await reportForm.fillNameInput('Test add observable e2e 2');
    await reportPage.getCreateReportButton().click();
    await reportPage.getItemFromList('Test add observable e2e 2').click();
    await expect(reportDetailsPage.getReportDetailsPage()).toBeVisible();
    await reportDetailsPage.getObservablesTab().click();
    await expect(containerObservablesPage.getContainerObservablesPage()).toBeVisible();
    await containerObservablesPage.getAddObservableListButton().click();
    await containerAddObservablesPage.createNewIPV4Observable('9.9.9.9');
    await expect(containerAddObservablesPage.getObservable('IPv4 address 9.9.9.9')).toBeVisible();
    await containerAddObservablesPage.getObservable('IPv4 address 9.9.9.9').click();
    await containerAddObservablesPage.getCloseObservablesListButton().click();
    await expect(containerObservablesPage.getObservableInContainer('IPv4 address 9.9.9.9')).toBeVisible();

    // Enable report references and check that removing observable asks for an external reference
    await page.goto('/dashboard/settings/customization/entity_types');
    await page.getByRole('link', { name: 'Report' }).click();
    await page.locator('span').filter({ hasText: 'Enforce references' }).click();

    await page.goto('/dashboard/analyses/reports');
    await reportPage.getItemFromList('Test add observable e2e 2').click();
    await reportDetailsPage.getObservablesTab().click();
    await expect(containerObservablesPage.getContainerObservablesPage()).toBeVisible();
    await containerObservablesPage.getAddObservableListButton().click();
    await expect(containerAddObservablesPage.getObservable('IPv4 address 9.9.9.9')).toBeVisible();
    await containerAddObservablesPage.getObservable('IPv4 address 9.9.9.9').click();
    await expect(commitMessagePage.getPage()).toBeVisible();
    await commitMessagePage.getAddNewReferenceButton().click();
    await commitMessagePage.fillNewReferenceSourceNameInput('SourceTest');
    await commitMessagePage.fillNewReferenceExternalIDInput('SourceTest');
    await commitMessagePage.getNewReferenceCreateButton().click();
    await commitMessagePage.getValidateButton().click();
    await containerAddObservablesPage.getCloseObservablesListButton().click();
    await expect(containerObservablesPage.getObservableInContainer('IPv4 address 9.9.9.9')).toBeHidden();

    // Clean up report "enable references" configuration
    await page.goto('/dashboard/settings/customization/entity_types');
    await page.getByRole('link', { name: 'Report' }).click();
    await page.locator('span').filter({ hasText: 'Enforce references' }).click();
  });
});
