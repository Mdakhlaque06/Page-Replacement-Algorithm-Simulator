function fifo(pages, capacity) {
    let memory = [];
    let faults = 0;

    pages.forEach(page => {
        if (!memory.includes(page)) {
            faults++;
            if (memory.length === capacity) {
                memory.shift();
            }
            memory.push(page);
        }
    });

    return faults;
}

function lru(pages, capacity) {
    let memory = [];
    let faults = 0;

    pages.forEach(page => {
        if (!memory.includes(page)) {
            faults++;
            if (memory.length === capacity) {
                memory.shift();
            }
        } else {
            memory.splice(memory.indexOf(page), 1);
        }
        memory.push(page);
    });

    return faults;
}

function lfu(pages, capacity) {
    let memory = [];
    let freq = {};
    let faults = 0;

    pages.forEach(page => {
        freq[page] = (freq[page] || 0) + 1;

        if (!memory.includes(page)) {
            faults++;
            if (memory.length === capacity) {
                let lfuPage = memory.reduce((a, b) => freq[a] < freq[b] ? a : b);
                memory.splice(memory.indexOf(lfuPage), 1);
            }
            memory.push(page);
        }
    });

    return faults;
}

function optimal(pages, capacity) {
    let memory = [];
    let faults = 0;

    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];

        if (!memory.includes(page)) {
            faults++;

            if (memory.length < capacity) {
                memory.push(page);
            } else {
                let future = pages.slice(i + 1);
                let index = memory.map(m => {
                    let idx = future.indexOf(m);
                    return idx === -1 ? Infinity : idx;
                });

                let replaceIndex = index.indexOf(Math.max(...index));
                memory[replaceIndex] = page;
            }
        }
    }

    return faults;
}

function runSimulation() {
    let pagesInput = document.getElementById("pages").value;
    let capacity = parseInt(document.getElementById("frames").value);

    if (!pagesInput) {
        alert("Please enter page reference string!");
        return;
    }

    let pages = pagesInput.split(" ").map(Number);

    let results = {
        FIFO: fifo(pages, capacity),
        LRU: lru(pages, capacity),
        LFU: lfu(pages, capacity),
        Optimal: optimal(pages, capacity)
    };

    let total = pages.length;

    let best = Object.keys(results).reduce((a, b) =>
        results[a] < results[b] ? a : b
    );

    let output = "";

    for (let algo in results) {
        let faults = results[algo];
        let hits = total - faults;
        let hitRatio = (hits / total).toFixed(3);
        let faultRatio = (faults / total).toFixed(3);

        output += `
            <div class="result-card ${algo === best ? "best" : ""}">
                <h3>${algo}</h3>
                <p>Page Faults: ${faults}</p>
                <p>Hits: ${hits}</p>
                <p>Hit Ratio: ${hitRatio}</p>
                <p>Fault Ratio: ${faultRatio}</p>
            </div>
        `;
    }

    document.getElementById("results").innerHTML = output;
}