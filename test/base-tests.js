var chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('test', () => {

    it('should pass', () => {
        expect(true).to.be.equals(true);
    });

})
