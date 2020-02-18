abstract class IRouter {
  public abstract get(path: string, handler: string): boolean;
  public abstract post(path: string, handler: string): boolean;
  public abstract put(path: string, handler: string): boolean;
  public abstract delete(path: string, handler: string): boolean;
  public abstract patch(path: string, handler: string): boolean;
}

export default IRouter;
