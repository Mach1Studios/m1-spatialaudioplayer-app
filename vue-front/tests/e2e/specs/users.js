describe('Users', () => {
  const username = 'm1';
  const password = 'goodpassbro';

  it('Visits the users root url', () => {
    cy.login(username, password);
    cy.visit('/users');
    cy.url().should('eq', `${Cypress.config().baseUrl}users`);
  });
  it('Users List delete button for m1', () => {
    cy.login(username, password);
    cy.visit('/users');
    cy.url().should('eq', `${Cypress.config().baseUrl}users`);

    cy.get('#UsersList')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.user-list');

    cy.get('table')
      .should('be.exist')
      .and('have.class', 'table-user-list');

    cy.get('table')
      .should('be.exist')
      .and('have.class', 'table-user-list');
    cy.get('td').eq(1).contains('m1');
    cy.get('td').eq(2).contains('support@mach1.tech');
    cy.get('td').eq(3).contains('admin');
    cy.get('td').eq(4);
    cy.get('td').eq(5).contains('button', 'edit');
    cy.get('td').eq(6).contains('button', 'delete').click();

    cy.get('.notification')
      .should('be.visible')
      .should('have.class', 'pink')
      .and('contain', 'You cannot delete yourself');
  });
  it('Users List add button', () => {
    cy.login(username, password);
    cy.visit('/users');
    cy.url().should('eq', `${Cypress.config().baseUrl}users`);

    cy.get('#UsersList')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.user-list');

    cy.get('button')
      .should('be.exist')
      .contains('Add user')
      .click({ force: true });
    cy.get('.modal')
      .should('be.visible')
      .contains('Add user');
    cy.get('input[name=nickname]').last().type('m11');
    cy.get('input[name=email]').last().type('m11@gmail.com');
    cy.get('input[name=password]').last().type('12345678');
    cy.get('select').last().select('user').should('have.value', 'user');
    // cy.get('button[type=button]').contains('add').click({ force: true });
    cy.get('form.add-user').last().submit();
    cy.get('button').contains('highlight_off').click({ force: true });
  });
  it('Users List edit button', () => {
    cy.login(username, password);
    cy.visit('/users');
    cy.url().should('eq', `${Cypress.config().baseUrl}users`);

    cy.get('#UsersList')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.user-list');

    cy.get('table')
      .should('be.exist')
      .and('have.class', 'table-user-list');
    cy.get('td').eq(8).contains('m11');
    cy.get('td').eq(9).contains('m11@gmail.com');
    cy.get('td').eq(10).contains('user');
    cy.get('td').eq(11);
    cy.get('td').eq(12).contains('button', 'edit').click();
    cy.get('.modal')
      .should('be.visible')
      .contains('Update user');
    cy.get('input[name=nickname]').first().focus().clear();
    cy.get('input[name=nickname]').invoke('val', 'm13');
    cy.get('input[name=email]');
    cy.get('input[name=password]');
    cy.get('select').first().select('user', { force: true }).should('have.value', 'user');
    cy.get('button[type=button]').contains('Save').click({ force: true });

    cy.get('form.add-user').first().submit();
    cy.get('button').contains('highlight_off').click({ force: true });
  });
  it('Users List delete button for m11', () => {
    cy.login(username, password);
    cy.visit('/users');
    cy.url().should('eq', `${Cypress.config().baseUrl}users`);

    cy.get('#UsersList')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.user-list');

    cy.get('table')
      .should('be.exist')
      .and('have.class', 'table-user-list');

    cy.get('table')
      .should('be.exist')
      .and('have.class', 'table-user-list');
    cy.get('td').eq(8).contains('m11');
    cy.get('td').eq(9).contains('m11@gmail.com');
    cy.get('td').eq(10).contains('user');
    cy.get('td').eq(11);
    cy.get('td').eq(12).contains('button', 'edit');
    cy.get('td').eq(13).contains('button', 'delete').click();
    cy.getCookies('table-user-list').should('have.length', 2);
    cy.clearCookies();
    cy.getCookies().should('be.empty');
  });
});
