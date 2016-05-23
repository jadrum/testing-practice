var request = require("request"),
    base_url = "http://localhost:3000/",
    helloWorld = require("../app.js"),
    assert = require('assert'),
    expect = require('chai').expect,
    user_url = "http://localhost:3000/users/1/",
    supertest = require('supertest'),
    api = supertest('http://localhost:3000'),
    apiUser = supertest('http://localhost:3000/users/1/');    

describe("Hello World Test", function() {

    describe("GET /", function() {

        it("returns status code 200", function(done) {
        
            request.get(base_url, function(error, response, body) {

                assert.equal(200, response.statusCode);
                done();

            });

        });

        it("returns Hello World", function(done) {

            request.get(base_url, function(error, response, body) {

                //expect(body).toBe("Hello World");
                assert.equal("Hello World", body);
                helloWorld.closeServer();
                done();

            });

        });

    });

    describe("GET /users/1", function() {

        it("returns status code 200", function(done) {
            request.get(user_url, function(error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            });
        });

        it("should be an object with keys and values", function(done) {
            request.get(user_url, function(error, response, body) {
                var res = JSON.parse(response.body);
                expect(res).to.have.property("name");
                expect(res.name).to.not.equal(null);
                expect(res.name).to.equal("Karen");
                done();
            });
        });

        it('should be updated with a new name', function(done) {
            api.put('/users/1')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({ 
                name: "Kevin",
                email: "kevin@example.com",
                phoneNumber: "9998887777",
                role: "editor"
            })
            .end(function(error, response) {
                expect(response.body.name).to.equal("Kevin");
                expect(response.body.email).to.equal("kevin@example.com");
                expect(response.body.phoneNumber).to.equal("9998887777");
                expect(response.body.role).to.equal("editor");
                done();
            });
        });

        it('should not be able to access other users locations', function(done) {
            api.get('/users/2/location')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                userId: 1,
            })
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.error.text).to.equal("Unauthorized");
                done();
            });
        });

        before(function(done) {
            api.post('/locations')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                addressStreet: "111 Main St.",
                addressCity: "Charlotte",
                addressState: "NC",
                addressZip: "28277",
                userId: 1
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                location1 = res.body;
                done();
            });
        });

        it('should access their own locations', function(done) {
            api.get('/users/1/location')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                userId: 1,
            })
            .expect(200)
            .end(function (error, response) {
                 expect(response.body.addressStreet).to.equal("111 Main St.");
                 expect(response.body.addressCity).to.equal("Charlotte");
                 expect(response.body.userId).to.equal(1);
                 done();
            });
        });
    });
});
