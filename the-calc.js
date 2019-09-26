
const addToPool = (name, thing, pool) => {
    console.log(name, thing, pool);
    const node = document.createElement('div');
    node.addEventListener('click', () => node.remove());
    const html = `<p>${name}</p>`
    node.innerHTML = html;
    document.getElementById(pool).appendChild(node);
}

const list_things = (list_of_things) => {
    for (const specific_thing in list_of_things) {
        //fucking js object iteration...
        const thing = list_of_things[specific_thing];
        const effec = thing.energy / thing.metal * 100
        const html = `
        <h3>${specific_thing} (${thing.type})</h3>
        <p>Metal generated per second: ${thing.metal}</p>
        <p>Energy generated per second: ${thing.energy}</p>
        <p>Energy efficiency: ${effec}</p>
        `
        const node = document.createElement('div');
        node.innerHTML = html;
        node.className = 'carousel-item';
        node.className += (thing.mass < 0 || thing.energy < 0) ? ' drain' : ' producer';

        if (thing.type.includes("builder")) {
            const useButton = document.createElement('button');
            useButton.innerHTML = 'use';
            useButton.className = 'use-button';
            useButton.addEventListener('click', () => addToPool(specific_thing, thing, 'build_agents'));
            node.appendChild(useButton);
        }

        const buildButton = document.createElement('button');
        buildButton.innerHTML = 'build';
        buildButton.className = 'build-button';
        buildButton.addEventListener('click', () => addToPool(specific_thing, thing, 'build_tasks'));
        node.appendChild(buildButton);

        document.getElementById("unit_list").appendChild(node);
    }
}

const calculate = (list_of_things) => {
    const task_list = document.getElementById('build_tasks').children;
    let cumulative_mass_cost = 0;

    if (task_list.length === 0) {
        return
    }

    for (node of task_list) {
        const thing = list_of_things[node.innerText];
        cumulative_mass_cost += thing.metal_cost;
    }

    const agent_list = document.getElementById('build_agents').children;
    let cumulative_mass_input = 0;
    let cumulative_energy_input = 0;

    console.log(agent_list);
    for (node of agent_list) {
        const thing = list_of_things[node.innerText];
        cumulative_mass_input += thing.metal;
        cumulative_energy_input += thing.energy;
    }

    const efficiency = document.getElementById("current_econ").value
    const total_time = cumulative_mass_cost/cumulative_mass_input * efficiency/100;
    const nice_time = Number.parseFloat(total_time).toPrecision(2);
    const energy_time_cost = cumulative_energy_input * total_time;
    text =`
    Building these things will cost ${cumulative_mass_cost} Metal and ${energy_time_cost} Energy and take ${nice_time} Seconds
    `    
    document.getElementById("result").innerText = text;

}
document.getElementById("calculate").addEventListener("click", () => calculate(things));

list_things(things);

