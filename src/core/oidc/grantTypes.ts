export class GrantTypes {

  protected params: any = null;
  protected baseParams: any = null;
  protected options: any = null;

  constructor(options:any, params:any, grantType:string='credentials') {
      
    this.baseParams = { grant_type: grantType };
    this.params = { ...params };
    this.options = { ...options };

  }
  
  static getScopesParams(scope: any, scopeSeparator: string = ",") {
    if (!scope) {
      return null;
    }
    if (Array.isArray(scope)) {
      return {
        scope: scope.join(scopeSeparator)
      }
    }
    return {
      scope
    }
  }

  toObject() {
    const scopeParams = GrantTypes.getScopesParams(this.params.scope, this.options.scopeSeparator);
    return Object.assign(this.baseParams, this.params, this.options);
  }

}