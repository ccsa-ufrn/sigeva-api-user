import 'babel-polyfill'
import config from '../src/config';
import app from '../src/app';
import userModel from '../src/models/user';
import bcrypt from 'bcrypt';
import moment from 'moment';
import async from 'async';

var chai = require('chai'),
  expect = chai.expect,
  chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('POST / :', () => {

  let server;

  before((done) => {
    server = app.listen(3330, () => { });

    // emptying collection
    userModel.remove({}, () => {
      // adding a new user to test database
      bcrypt.genSalt(10, (errGenSalt, salt) => {
        bcrypt.hash('123456', salt, (errHash, hash) => {
          let user = new userModel({
            login: 'my-login',
            password: hash
          });
          user.save();
          done();
        });
      });
    });
  })

  it('when no "login" and "password" are passed, ' +
    'should return an error', (done) => {

      chai.request(server)
        .post('/')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.not.be.an('undefined'); // required fields are empty
          expect(res.body.target).to.not.be.an('undefined');
          expect(res.body.target.length).to.be.equals(2);
          expect(res.body.target[0].field).to.be.equals('login');
          expect(res.body.target[1].field).to.be.equals('password');
          done();
        });

    });

  it('when only "login" is given, ' +
    'should return an error', (done) => {

      chai.request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .send({ login: 'my-login' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.not.be.an('undefined'); // required fields are empty
          expect(res.body.target).to.not.be.an('undefined');
          expect(res.body.target.length).to.be.equals(1);
          expect(res.body.target[0].field).to.be.equals('password');
          done();
        });

    });

  it('when only "password" is given, ' +
    'should return an error', (done) => {

      chai.request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .send({ password: 'my-password' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.not.be.an('undefined'); // required fields are empty
          expect(res.body.target).to.not.be.an('undefined');
          expect(res.body.target.length).to.be.equals(1);
          expect(res.body.target[0].field).to.be.equals('login');
          done();
        });

    });

  it('when tries create an user with already existent login, ' +
    'should return an error', (done) => {

      chai.request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .send({ login: 'my-login', password: '1045678' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.not.be.an('undefined'); // user already exists
          done();
        });

    });

  it('should create a new user', (done) => {

    chai.request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send({ login: 'newuser', password: '123456' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body['_id']).to.not.be.an('undefined');
        expect(res.body['isActive']).to.not.be.an('undefined');
        expect(res.body['login']).to.not.be.an('undefined');
        expect(res.body['password']).to.be.an('undefined');
        done();
      });

  });

  after(() => {
    server.close();
  })

})

describe('DELETE / :', () => {

  let server;
  let theuser;

  before((done) => {
    server = app.listen(3330, () => { });

    // emptying collection
    userModel.remove({}, () => {
      // adding a new user to test database
      bcrypt.genSalt(10, (errGenSalt, salt) => {
        bcrypt.hash('123456', salt, (errHash, hash) => {
          let user = new userModel({
            login: 'my-login',
            password: hash
          });
          user.save((err, user) => {
            theuser = user;
          });
          done();
        });
      });
    });
  })

  it('should be working', (done) => {

    chai.request(server)
      .post('/')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });

  });

  it('empty _id field should return an error', (done) => {

    chai.request(server)
      .delete('/')
      .set('Content-Type', 'application/json')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.not.be.an('undefined'); // required fields are empty
        expect(res.body.target).to.not.be.an('undefined');
        expect(res.body.target.length).to.be.equals(1);
        expect(res.body.target[0].field).to.be.equals('_id');
        done();
      });

  });

  it('when you try to remove a non-existent user' +
    ' it should return an error', (done) => {

      chai.request(server)
        .delete('/')
        .set('Content-Type', 'application/json')
        .send({ _id: '0' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.not.be.an('undefined');
          expect(res.body.error).to.be.equals('The user doesn\'t exists');
          done();
        });

    });

  it('should remove (deactivate) an user successfully', (done) => {

    chai.request(server)
      .delete('/')
      .set('Content-Type', 'application/json')
      .send({ _id: theuser._id })
      .end((err, res) => {

        expect(res).to.have.status(200);
        expect(res.body._id).to.be.equals(theuser._id);
        expect(res.body.login).to.be.equals(theuser.login);
        expect(res.body.isActive).to.be.equals(theuser.isActive);

        userModel.findById(theuser._id)
          .exec((err, res) => {
            expect(res.isActive).to.be.equals(false);
            expect(moment(res.modifiedAt).diff(theuser.modifiedAt)).to.not.be.equals(0);
            done();
          })

      });

  });

  after(() => {
    server.close();
  })

})

describe('GET / :', () => {

  let server;

  before((done) => {
    server = app.listen(3330, () => { });

    // emptying collection
    userModel.remove({}, () => {

      async.parallel([
        (callback) => {
          // adding a new user to test database
          bcrypt.genSalt(10, (errGenSalt, salt) => {
            bcrypt.hash('157957', salt, (errHash, hash) => {
              let user = new userModel({
                login: 'user1',
                password: hash
              });
              user.save();
              callback(null, null);
            });
          });
        },
        (callback) => {
          // adding a new user to test database
          bcrypt.genSalt(10, (errGenSalt, salt) => {
            bcrypt.hash('12345', salt, (errHash, hash) => {
              let user = new userModel({
                login: 'user2',
                password: hash
              });
              user.save();
              callback(null, null);
            });
          });
        },
        (callback) => {
          // adding a new user to test database
          bcrypt.genSalt(10, (errGenSalt, salt) => {
            bcrypt.hash('123', salt, (errHash, hash) => {
              let user = new userModel({
                login: 'user3',
                password: hash
              });
              user.save();
              callback(null, null);
            });
          });
        }
      ], (err, res) => {
        done();
      })
    });

  })


  it('should works', () => {

    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });

  })

  after(() => {
    server.close();
  })

});

describe('/authenticate', () => {

  let server;

  before((done) => {
    server = app.listen(3330, () => { });

    // emptying collection
    userModel.remove({}, () => {
      // adding a new user to test database
      bcrypt.genSalt(10, (errGenSalt, salt) => {
        bcrypt.hash('12345', salt, (errHash, hash) => {
          let user = new userModel({
            login: 'should-login',
            password: hash
          });
          user.save();
          done();
        });
      });
    });
  })

  it('when credentials are wrong should return an error', (done) => {

    chai.request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send({ login: 'should-login', password: '12345' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.not.be.an('undefined'); // wrong login or password
        done();
      });

  });

  after(() => {
    server.close();
  })

})
