import { updateChart } from "./chart.js";
import { displayBestCombination } from "./ui.js";
/**
 * Genetic algorithm implementation
 *
 * @class GA
 */
class GA {

    /**
     * Creates an instance of GA.
     * @param {Object} items phenotype of current optimization problem
     * @param {Number} [populationCap=25] number of max population inside one generation
     * @param {Number} [maxCapacity=400] parameter for current optimization problem - effects fitness function
     * @param {Number} [maxGeneration=100] max number of iterations of evolution process
     * @memberof GA
     */
    constructor(items, populationCap = 25, maxCapacity = 400, maxGeneration = 100) {
        this.items = items;
        this._generation = 0;
        this._population = [];
        this._newPopulation = [];
        this.populationCap = populationCap;
        this.maxCapacity = maxCapacity;
        this.maxGeneration = maxGeneration;
        this.weightList= [];
        this.valueList = [];
        this.mutationRate = 0.1;
        this.crossoverRate = 0.75;
        this.bestInPopulation = {"gene":[], "fitness":0 };
    }

    init() {
        for(let i=0;i<this.items.length;i++)
        {
            this.weightList.push(this.items[i].weight);
            this.valueList.push(this.items[i].value);
        }
        this.generateInitialPopulation();
    }

    generateInitialPopulation()
    {
        for(let i=0;i<this.populationCap;i++)
        {
            let candidate = new DNA(this.weightList.length);
            fitnessEvaluation(candidate, this.weightList, this.valueList, this.maxCapacity);
            this._population.push(candidate);
        }
        // this._generation += 1;
        this.executeGeneticAlgorithm();
    }

    generateNewPopulation()
    {
        this._newPopulation = []
        for(let i=0;i<Math.floor(this.populationCap/2);i++)
        {
            var parents = tournamentSelection(this._population);
            var parent1 = parents[0];
            var parent2 = parents[1];
            var childs = singlePointCrossover(parent1.chromosome, parent2.chromosome, this.crossoverRate);
            var child1 = childs[0];
            var child2 = childs[1];
            mutateCandidate(child1, this.mutationRate);
            mutateCandidate(child2, this.mutationRate);
            fitnessEvaluation(child1, this.weightList, this.valueList, this.maxCapacity);
            fitnessEvaluation(child2, this.weightList, this.valueList, this.maxCapacity);
            this._newPopulation.push(child1);
            this._newPopulation.push(child2);
        }
        var temp = selectNMBest(this._population, this._newPopulation);
        this._population = temp;
        this._generation += 1;
    }

    executeGeneticAlgorithm()
    {
        while(true)
        {
            let bestInd=0;
            let maxFit = 0;
            let avg = 0;
            for(let i=0;i<this.populationCap;i++)
            {
                if(this._population[i].fitness>maxFit)
                {
                    maxFit = this._population[i].fitness;
                    bestInd = i;
                }
                avg += this._population[i].fitness;
            }
            // console.log(this._population);
            updateChart(avg/this.populationCap, this._generation);
            this.bestInPopulation.gene = this._population[bestInd].chromosome.slice();
            this.bestInPopulation.fitness = this._population[bestInd].fitness;
            console.log(`Generation: ${this._generation}\nBEST: ${this.bestInPopulation.fitness}`);
            if(this._generation<this.maxGeneration)
            {
                this.generateNewPopulation();
            }
            else
            {
                break;
            }
        }
        displayBestCombination(this.bestInPopulation, this.items);
    }
}

/**
 * Genetic algorithm
 *
 * @class DNA
 */
 class DNA {
    /**
     * Creates an instance of DNA
     * @param {Array} chromosome genotype of current optimization problem
     * @param {Number} fitness fitness of the chromosome
     * @memberof DNA
     */
    constructor(chromoSize){
        this.chromosome = this.generateChromosome(chromoSize);
        this.fitness = 0;
    }
    generateChromosome(chromoSize) {
        let chromosome = [];
        for(let i=0;i<chromoSize;i++)
        {
            chromosome.push(Math.floor(Math.random()*2));
        }
        return chromosome;
    }
}

/**
 * Evaluates fitness of a candidate
 * 
 * @param {DNA} candidate candidate of the population
 * @param {Array} weightList weights of choosed items for golf trunk
 * @param {Array} valueList value of choosed items for golf trunk
 * @param {Number} maxCapacity maximum capacity of the golf trunk
 */
function fitnessEvaluation(candidate, weightList, valueList, maxCapacity)
{
    let fitness = 0;
    let weightCheck = 0;
    for(let i=0;i<weightList.length;i++)
    {
        if(candidate.chromosome[i]==1)
        {
            fitness += valueList[i];
            weightCheck += weightList[i];
        }
    }
    if(weightCheck>maxCapacity)
    {
        fitness = 0;
    }
    candidate.fitness = fitness;
}

/**
 * Returns two childs after performing crossover
 *
 * @param {Array} parent1 chromosome of the first parent
 * @param {Array} parent2 chromosome of the second parent
 * @return {DNA[]} generated childs after crossover
 */
function singlePointCrossover(parent1, parent2, crossoverRate)
{
    let child1 = new DNA(parent1.length);
    let child2 = new DNA(parent1.length);
    let crossOverProb = Math.random();
    if(crossOverProb<crossoverRate)
    {
        let mid = Math.floor(parent1.length/2);
        for(let i=0;i<parent1.length;i++)
        {
            if(i<mid)
            {
                child1.chromosome[i] = parent1[i];
                child2.chromosome[i] = parent2[i];
            }
            else
            {
                child1.chromosome[i] = parent2[i];
                child2.chromosome[i] = parent1[i];
            }
        }
    }
    else
    {
        child1.chromosome = parent1.slice();
        child2.chromosome = parent2.slice();
    }
    return [child1, child2]
}

/**
 * Mutate individual genes of the candidate according to mutation rate
 *
 * @param {DNA} candidate candidate of the population
 */
function mutateCandidate(candidate, mutationRate)
{
    for(let i=0;i<candidate.chromosome.length;i++)
    {
        let mutatingProb = Math.random();
        if(mutatingProb<mutationRate)
        {
            if(candidate.chromosome[i]==1)
            {
                candidate.chromosome[i] = 0;
            }
            else
            {
                candidate.chromosome[i] = 1;
            }
        }
    }
}

/**
 * Return a candidate of the population after performing selection
 *
 * @param {DNA[]} population population pool for performing selection
 * @return {DNA[]} selected parents from the population pool
 */
function tournamentSelection(population)
{
    // console.log(population);
    let bestInd=0;
    let bestInd1 = 0;
    let maxFit = 0;
    for(let i=0;i<10;i++)
    {
        let index = Math.floor(Math.random()*population.length);
        // console.log(bestInd);
        if(population[index].fitness>maxFit)
        {
            maxFit = population[index].fitness;
            bestInd1 = bestInd;
            bestInd = index;
        }
    }
    // console.log(bestInd);
    return [population[bestInd], population[bestInd1]];
}


/**
 * Returns N best individuals out of N+M individuals
 *
 * @param {DNA[]} population population pool of the current generation
 * @param {DNA[]} newPopulation population pool of the newly generated candidates
 * @return {DNA[]} population pool for the next generation
 */
function selectNMBest(population, newPopulation)
{
    let NMPool = population.concat(newPopulation);
    NMPool.sort(function(cand1, cand2)
    {
        return ((cand1.fitness < cand2.fitness) ? -1 : ((cand1.fitness == cand2.fitness) ? 0 : 1));
    });
    // console.log(NMPool);
    let selectNFromNM = []
    let N = NMPool.length;
    for(let i=0;i<population.length;i++)
    {
        selectNFromNM.push(NMPool[N-1-i]);
    }
    selectNFromNM = shuffle(selectNFromNM);
    return selectNFromNM;
}


/**
 * Return array after shuffling it
 *
 * @param {Array} array array to perform shuffling
 * @return {Array} array after shuffling
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}



export { GA };
