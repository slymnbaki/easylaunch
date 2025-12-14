describe('Easylaunch User Flow', () => {
  it('Kullanıcı ana sayfayı ve KYC formunu görüntüler', () => {
    cy.visit('/');
    cy.contains('Easylaunch');
    cy.visit('/kyc');
    cy.get('form').should('exist');
  });
});
