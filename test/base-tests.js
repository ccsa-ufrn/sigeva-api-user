import 'babel-polyfill'
import config from '../src/config';
import app from '../src/app';

var chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('POST /', () => {

    let server;

    before(() => {
        server = app.listen(3330, () => { });
    })

    it('should pass', (done) => {

        chai.request(server)
        .post('/')
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });

    });

    after(() => {
        server.close();
    })

})
