const config = browser.params;
import UserModel from '../../../server/api/user/user.model';
import {LoginPage} from '../login/login.po';
import {NavbarComponent} from '../../components/navbar/navbar.po';

describe('Logout View', function() {
    const login = async (user) => {
        await browser.get(`${config.baseUrl}/login`);

        const loginPage = new LoginPage();
        await loginPage.login(user);
    };

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
    };

    beforeEach(async function() {
        await UserModel
            .remove();

        await UserModel.create(testUser);

        await login(testUser);
    });

    describe('with local auth', function() {
        it('should logout a user and redirect to "/home"', async function() {
            let navbar = new NavbarComponent();

            browser.ignoreSynchronization = false;
            await browser.wait(() => browser.getCurrentUrl(), 5000, 'URL didn\'t change after 5s');
            browser.ignoreSynchronization = true;

            expect(await browser.getCurrentUrl()).toBe(`${config.baseUrl}/home`);
            expect(await navbar.navbarAccountGreeting.getText()).toBe(`Hello ${testUser.name}`);

            await navbar.logout();

            navbar = new NavbarComponent();

            expect(await browser.getCurrentUrl()).toBe(`${config.baseUrl}/home`);
            expect(await navbar.navbarAccountGreeting.isDisplayed()).toBe(false);
        });
    });
});
