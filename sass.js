import * as sass from 'sass'
import { writeFile } from 'fs';

const scssFilename = './scss/styles.scss';
const result = sass.compile(scssFilename);

// OR

// Note that `compileAsync()` is substantially slower than `compile()`.
//const result = await sass.compileAsync(scssFilename);

console.log(result.css)
writeFile('public/css/style.css', result.css, err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });