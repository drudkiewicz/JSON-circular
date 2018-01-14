/* global require, describe, it */
'use strict';
require('./index.js');
const expect = require('chai').expect;

describe('Encode circulars function', () => {
	describe('Not circular', () => {
		it('should return object without any modification', (done) => {
			const input = { a: 'a', b: 1 };
			const expectedOutput = {a: 'a', b: 1};

			const output = JSON.encodeCirculars(input);

			expect(output).to.deep.equal(expectedOutput);
			done();
		});

		describe('Primitive values', () => {
			it('should return value without any modification', (done) => {
				const input = 'test';
				const expectedOutput = 'test';

				const output = JSON.encodeCirculars(input);

				expect(output).to.equal(expectedOutput);
				done();
			});

			it('should return null value without any modification', (done) => {
				const input = null;
				const expectedOutput = null;

				const output = JSON.encodeCirculars(input);

				expect(output).to.equal(expectedOutput);
				done();
			});

			it('should return object value without any modification', (done) => {
				const input = new String('a'); // eslint-disable-line no-new-wrappers
				const expectedOutput = new String('a'); // eslint-disable-line no-new-wrappers

				const output = JSON.encodeCirculars(input);

				expect(output).to.deep.equal(expectedOutput);
				done();
			});
		});
	});

	describe('Circular', () => {
		describe('Root', () => {
			describe('Array input', () => {
				describe('in the first level', () => {
					it('should replace circular with a path to the key', (done) => {
						const input = [ 'a', 1 ];
						input[2] = input;
						const expectedOutput = ['a', 1, { $ref: '$'}];

						const output = JSON.encodeCirculars(input);

						expect(output).to.deep.equal(expectedOutput);
						done();
					});
				});
			});

			describe('Object input', () => {
				describe('in the first level', () => {
					it('should replace circular with a path to the key', (done) => {
						const input = { a: 'a', b: 1 };
						input.c = input;
						const expectedOutput = { a: 'a', b: 1, c: {$ref: '$'}};

						const output = JSON.encodeCirculars(input);

						expect(output).to.deep.equal(expectedOutput);
						done();
					});
				});
			});
		});

		describe('Second level', () => {
			it('should replace circular with a path to the key', (done) => {
				const input = { a: 'a', b: [1] };
				input.b[1] = input.b;
				const expectedOutput = { a: 'a', b: [1, { $ref: '$.b' }]};

				const output = JSON.encodeCirculars(input);

				expect(output).to.deep.equal(expectedOutput);
				done();
			});
		});
	});
});

describe('Decode circulars function', () => {
	describe('Not circular', () => {
		it('should return JS object without any modification', (done) => {
			const input = { a: 'a', b: 1 };

			const output = JSON.decodeCirculars(input);

			expect(output).to.deep.equal(input);
			done();
		});

		describe('Primitive objects', () => {
			it('should return JSON string without any modification', (done) => {
				const input = "test";
				const expectedOutput = 'test';

				const output = JSON.decodeCirculars(input);

				expect(output).to.equal(expectedOutput);
				done();
			});
		});
	});

	describe('Circular', () => {
		describe('Root', () => {
			describe('Array input', () => {
				describe('in the first level', () => {
					it('should replace circular with a path to the key', (done) => {
						const input = [ 'a', 1, {"$ref":"$"} ];
						const expectedOutput = [ 'a', 1 ];
						expectedOutput[2] = expectedOutput;

						const output = JSON.decodeCirculars(input);

						expect(output).to.deep.equal(expectedOutput);
						done();
					});
				});
			});

			describe('Object input', () => {
				describe('in the first level', () => {
					it('should replace a path with a refence to an object taken from path', (done) => {
						const input = { a: 'a', b: 1, c: {"$ref":"$"} };
						const expectedOutput = { a: 'a', b: 1 };
						expectedOutput.c = expectedOutput;

						const output = JSON.decodeCirculars(input);

						expect(output).to.deep.equal(expectedOutput);
						done();
					});
				});
			});
		});

		describe('Second level', () => {
			it('should replace a path with a referenced object', (done) => {
				const input = { a: 'a', b: [1, {"$ref":"$.b"}] };
				const expectedOutput = { a: 'a', b: [1] };
				expectedOutput.b[1] = expectedOutput.b;

				const output = JSON.decodeCirculars(input);

				expect(output).to.deep.equal(expectedOutput);
				done();
			});
		});
	});
});
