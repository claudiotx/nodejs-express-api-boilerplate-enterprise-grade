const plugin = function updateOnPlugin (schema: any, options: any) {
  // Add new property to Schema
  schema.add({ updatedOn: Date});
  // Pre Hook
  schema.pre('save', function(next: any) {
      this.updatedOn = new Date;
      next();
  });
  if (options && options.index) {
      schema.path('updatedOn').index(options.index);
  }
};
export default plugin;