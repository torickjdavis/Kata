import bcrypt from 'bcrypt';

const plainText = 'PASSWORD_IS_DUMB';

const hash = await bcrypt.hash(plainText, 10);

const hashWorks = await bcrypt.compare(plainText, hash);
console.assert(hashWorks, `Hash ${hash} ${plainText}`);

const rehash = await bcrypt.hash(hash, 10);
const rehashWorks = await bcrypt.compare(rehash, plainText);
console.assert(rehashWorks, `Rehash ${rehash} ${plainText}`);
