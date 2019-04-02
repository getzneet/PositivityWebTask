import { range, shuffle, assert, sum } from './utils.mjs';


/* Abstract experience model */
function Exp(
    {
        nOption,
        nContext,
        rewards,
        probs,
        interleaved,
        nInterleaved,
        nTrialPerContext,
        nTrial
    }={}
    ) {

    // private members (accessible in the whole function)
    this.nOption = nOption;
    this.nContext = nContext;

    this.rewards = rewards;
    this.probs = probs;
    this.nTrialPerContext = nTrialPerContext;
    this.nTrial = nTrial;
    this.nInterleaved = nInterleaved;
    this.interleaved = interleaved;

    this.order = [];
    this.context = [];
    this.r = [];
    this.p = [];

    assert(
        sum(nTrialPerContext) === nTrial, 'nTrial does not correspond to nTrialPerContext'
    );

    /* =================== private methods ================= */

    /* randomize order of options on screens
    idx=0 is the most far on the left
    idx=max ist the most far on the right */
    this.randomizeOrder = function () {
        for (let t = 0; t < this.nTrial; t++) {
            this.order.push(shuffle(range(this.nOption)));
        }
        assert(this.order.length === this.nTrial, 'Error in this.order length');
    };

    this.initContexts = function () {
        // first define contexts for each time-steps
        if (this.interleaved) {
            for (let i = 0; i < this.nTrial; i += this.nInterleaved) {
                this.context = this.context.concat(
                    shuffle(range(0, nContext - 1))
                );
            }
        } else {
            for (let i = 0; i < this.nContext; i++) {
                this.context = this.context.concat(
                    Array(this.nTrialPerContext[i]).fill(i)
                )
            }
        }
        // set rewards and probabilities accordingly
        for (let t = 0; t < this.nTrial; t++) {
            this.r[t] = this.rewards[this.context[t]];
            this.p[t] = this.probs[this.context[t]];
        }
        assert(this.context.length === this.nTrial, 'Errors in context length.');
    };

    /* =================== public methods ================== */

    // main init method
    this.init = function () {
        this.initContexts();
        this.randomizeOrder();
    };

}

// set to true to test the module
// using "$ node --experimental-modules myscript.mjs"
main({test: false});

function main({test}={}) {
    if (test) {
        console.log('Testing module...');
        let nOption = 2;
        let nContext = 4;
        let rewards = [
            [[0, 0], [-1, 1]],
            [[0, 0], [-1, 1]],
            [[-1, 1], [-1, 1]],
            [[0, 1], [0, -1]]
        ];
        let probs = [
            [[0.5, 0.5], [0.5, 0.5]],
            [[0.5, 0.5], [0.5, 0.5]],
            [[0.25, 0.75], [0.75, 0.25]],
            [[0.5, 0.5], [0.5, 0.5]]
        ];
        let nTrialPerContext = [24, 24, 24, 24];
        let nTrial = 96;
        let nInterleaved = 4;
        let interleaved = true;

        let exp = new Exp(
            {
                nOption: nOption,
                nContext: nContext,
                rewards: rewards,
                probs: probs,
                nTrialPerContext: nTrialPerContext,
                nTrial: nTrial,
                nInterleaved: nInterleaved,
                interleaved: interleaved
            }
        );
        exp.init();
    }
}

