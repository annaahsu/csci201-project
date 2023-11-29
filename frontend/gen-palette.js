let net = [];


for(let i = 0; i < 10; ++i) {
    const res = await fetch(`https://lospec.com/palette-list/load?colorNumberFilterType=exact&colorNumber=8&page=${i}&tag=&sortingType=downloads`);
    const data = await res.json();
    const colors = data.palettes.map(d => d.colors.map(c => '#'+c));
    net = net.concat(colors);
}

console.log(net);
