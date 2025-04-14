/// <reference types="cypress" />

describe('DANKA3D Alap működés teszt', () => {
  it('Megnyitja a főoldalt', () => {
    cy.visit('http://localhost:3000');
    cy.contains('DANKA3D').should('exist');
  });

  it('Navigál a bejelentkezés oldalra a legördülő menüből', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Bejelentkezés').click({ force: true });
    cy.url().should('include', '/login');
  });

  it('Kitölti a bejelentkezés űrlapot', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('teszt@pelda.hu');
    cy.get('input[name="password"]').type('jelszo123');
    cy.get('button[type="submit"]').click();
  });

  it('Kosár oldal jogosultság ellenőrzése (login nélkül és után)', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Kosár').click({ force: true });
    cy.get('input[name="email"]', { timeout: 10000 }).should('exist');
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type('teszt@pelda.hu');
    cy.get('input[name="password"]').type('jelszo123');
    cy.get('button[type="submit"]').click();
    cy.visit('http://localhost:3000');
    cy.contains('Kosár').click({ force: true });
    cy.url().should('include', '/basket');
  });

  it('Navigál a Rendelések oldalra a menüből', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Rendelések').click({ force: true });
    cy.url().should('include', '/orders');
  });

  it('Navigál a Rólunk oldalra a menüből', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Rólunk').click({ force: true });
    cy.url().should('include', '/aboutus');
  });
});