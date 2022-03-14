# react-callback-ref

Same as React's `useCallback`, but always returns the same function reference!

Example:
```
import { useCallbackRef } from 'react-callback-ref';

function Component({ someProp }) {
  const callback = useCallbackRef(() => {
    // It's OK to access props/state in here.
    console.log(someProp);
    // No dependency list needed!
  });
  
  // `callback` will always be the same reference, 
  // so this will only run once:
  useEffect(() => {
    callback();
  }, [ callback ]); // (you can omit this dependency if you want)
  
  //...
}


TODO: 
- [ ] Update these docs
- [ ] Publish to NPM

