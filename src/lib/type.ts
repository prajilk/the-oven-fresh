// Define the Roles type
type Roles = 'admin' | 'manager' | 'delivery'; // Add more roles as needed

// You can also create a union type for specific roles dynamically
export type RolesSet = Roles; // Allows any string role, in case you want dynamic roles in the future
