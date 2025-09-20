// Test the validation schema
const { z } = require('zod');

const ListingsQuerySchema = z.object({
  ltype: z.enum(['hub', 'event']).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  verified: z.boolean().optional(),
  near: z.array(z.number()).length(2).optional(),
  radiusKm: z.number().min(0.1).max(5000).optional(),
  location: z.string().optional(),
});

// Test with coordinates
const testQuery = {
  near: [-99.1332, 19.4326],
  radiusKm: 2000
};

console.log('Testing query:', testQuery);

try {
  const result = ListingsQuerySchema.parse(testQuery);
  console.log('Validation passed:', result);
} catch (error) {
  console.log('Validation failed:', error.message);
  console.log('Error details:', error.issues);
}
