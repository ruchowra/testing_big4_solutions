abstract class ValueObject {
  public equals(Other: ValueObject): boolean {
    const myEntries = Object.entries(this);
    const otherEntries = Object.entries(Other);
    let ret = true;

    if (myEntries.length !== otherEntries.length) {
      ret = false;
    } else {
      myEntries.forEach((entry): void => {
        const index = otherEntries.findIndex((elem): boolean => elem[0] === entry[0]);

        if (index === -1) {
          ret = false;
        } else if (otherEntries[index][1] !== entry[1]) {
          ret = false;
        }
      });
    }

    return ret;
  }
}

export default ValueObject;
