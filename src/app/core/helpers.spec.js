const expect = require ('chai').expect;
const helpers = require ('../core/helpers');

describe('helpers',() => {
    describe('returnRegXResult',() => {
        it('should return correct string result', () => {
            const result = helpers.returnRegXResult('begin', 'end', 'beginaaaend');
            expect(result).to.equal('aaa');
        }),
        it('should return null, if start and end is not found', () => {
            const result = helpers.returnRegXResult('begin', 'end', 'test');
            expect(result).to.equal(null);
        }),
        it('should return null, if both start and end are not found', () => {
            const result1 = helpers.returnRegXResult('begin', 'end', 'begintest');
            expect(result1).to.equal(null);

            const result2 = helpers.returnRegXResult('begin', 'end', 'testend');
            expect(result2).to.equal(null);
        })
    }),
    describe('returnNumericValue',() => {
        it('should return only numeric result', () => {
            const result = helpers.returnNumericValue('testing 111.11 numeric value');
            expect(result).to.equal(111.11);
        })
    }),
    describe('removeHTMLtags',() => {
        it('should return only string without HTML tags', () => {
            const result = helpers.removeHTMLtags('test <br>content</br> end');
            expect(result).to.equal('test content end');
        })
    }),
    describe('sortDescending',() => {
        it('should return correct order result from highest price to lowest', () => {
            const result = helpers.sortDescending([
                {
                    id: 1,
                    name: 'subject 1',
                    price: 500
                },
                {
                    id: 2,
                    name: 'subject 2',
                    price: 1000
                },
                {
                    id: 3,
                    name: 'subject 3',
                    price: 200
                }
            ], 'price');

            expect(result[0].id).to.equal(2);
            expect(result[1].id).to.equal(1);
            expect(result[2].id).to.equal(3);
        }),
        it('should return correct order result from highest id to lowest', () => {
            const result = helpers.sortDescending([
                {
                    id: 1,
                    name: 'subject 1',
                    price: 500
                },
                {
                    id: 2,
                    name: 'subject 2',
                    price: 1000
                },
                {
                    id: 3,
                    name: 'subject 3',
                    price: 200
                }
            ], 'id');

            expect(result[0].id).to.equal(3);
            expect(result[1].id).to.equal(2);
            expect(result[2].id).to.equal(1);
        })
    })
})