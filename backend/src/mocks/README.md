# Mocks
A mock is any implementation of an interface that is produces _known and predictable output_. This is very useful for isolation testing, since faults in the interface implementation can be ruled out as causes for a failed unit-test. Any interface of sufficient complexity, or of sufficient latency, should be mocked.

Mock implementations do not share the same strict rule as the real-life implementations of interfaces do, in that mock implementations can have more public methods and store more state than the real world implementation, _as long as those additional methods and state is only accessed by the test_. The dependents of the interface **must never** call on a method that is not part of the public interface of that dependency.

It is, however, a good idea to make use of this additional freedom to create mock objects that can keep state and be polled by the testing framework to verify correct behavior.

An example would be a mock repository, where you can create an implementation `MockRepository` that looks similar to the below:

```
class MockRepository extends IRepository {
  /* This is not part of the public interface */
  public internalStore: object[] = [
    {
      id: 1,
      text: 'lorem ipsum'
    },
    {
      id: 2,
      text: 'lorem ipsum'
    },
    {
      id: 3,
      text: 'lorem ipsum'
    }
  ]

  public hasObject(id: number): boolean {
    return this.internalStore.map((element: object): number => {
      return element.id;
    }).indexOf(id) !== -1;
  }

  /* This is the public interface */
  public addObject(id: int, text: string) {
    this.internalStore.push({
      id,
      text,
    });
  }
  
  public deleteObject(id: int) {
    this.internalStore = this.internalStore.filter((element: object): boolean => {
      return element.id !== id;
    });
  }
}
```

The Api controller or service being tested can then use the addObject and deleteObject methods as expected, while the testing code can make use of the extended method hasObject to verify that objects were added or removed by the handler or service.