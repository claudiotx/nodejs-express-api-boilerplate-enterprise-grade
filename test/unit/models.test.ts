import { SampleModel } from '../../src/models/sample.model';
// Docs: https://jestjs.io/docs/en/tutorial-async

// The assertion for a promise must be returned.
it('Model contains the mandatory fields from FRs', () => {
  expect(SampleModel.schema.paths['identifier']).toBeDefined();
});