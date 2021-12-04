export class ModList extends Array{
    evaluateAll(data) {
        for (const mod of Object.keys(this)) {
            this[mod].evaluate(data);
        }
    }
}

export class Modifier {
    constructor(name, type, formula, user = true) {
        this.name = name;
        this.type = type;
        this._formula = formula;
        this.user = user;
        this._value = undefined;
        this._average = undefined;
    }

    evaluate(data, averageDice = false) {
        const result = Roll.replaceFormulaData(this.formula, data, {missing: 0, warn: true});

        // TODO: Finish
        result.replace(/(\d*)d(\d+).*[ +-]/gi)

        // TODO: Account for objects before eval
        this._value = Roll.safeEval(result) ?? 0;

        return this._value;
    }

    quickEvaluate(data) {
        this.evaluate();
        return this;
    }

    get formula() {
        return this._formula;
    }

    set formula(formula) {
        this._formula = formula;
        this._value = undefined;
    }

    get value() {
        if (this._value === undefined) {
            console.warn("Modifier value accessed without evaluating, returning 0")
            console.log(this, null, 4);
            return 0;
        }

        return this._value;
    }
}