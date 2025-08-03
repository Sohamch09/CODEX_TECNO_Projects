 class Calculator {
            constructor(previousOperandElement, currentOperandElement) {
                this.previousOperandElement = previousOperandElement;
                this.currentOperandElement = currentOperandElement;
                this.clear();
            }

            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
            }

            delete() {
                this.currentOperand = this.currentOperand.toString().slice(0, -1);
                if (this.currentOperand === '') {
                    this.currentOperand = '0';
                }
            }

            appendNumber(number) {
                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand = this.currentOperand.toString() + number.toString();
                }
            }

            chooseOperation(operation) {
                if (this.currentOperand === '0') return;
                if (this.previousOperand !== '') {
                    this.compute();
                }
                this.operation = operation;
                this.previousOperand = `${this.currentOperand} ${operation}`;
                this.currentOperand = '0';
            }

            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        computation = prev / current;
                        break;
                    default:
                        return;
                }
                
                this.currentOperand = computation.toString();
                this.operation = undefined;
                this.previousOperand = '';
            }

            updateDisplay() {
                this.currentOperandElement.innerText = this.currentOperand;
                this.previousOperandElement.innerText = this.previousOperand;
            }
        }

        const previousOperandElement = document.getElementById('previous-operand');
        const currentOperandElement = document.getElementById('current-operand');
        const calculator = new Calculator(previousOperandElement, currentOperandElement);

        // Button event listeners
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                calculator.appendNumber(button.innerText);
                calculator.updateDisplay();
            });
        });

        document.querySelectorAll('[data-operation]').forEach(button => {
            button.addEventListener('click', () => {
                calculator.chooseOperation(button.innerText);
                calculator.updateDisplay();
            });
        });

        document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
            calculator.compute();
            calculator.updateDisplay();
        });

        document.querySelector('[data-action="clear"]').addEventListener('click', () => {
            calculator.clear();
            calculator.updateDisplay();
        });

        document.querySelector('[data-action="delete"]').addEventListener('click', () => {
            calculator.delete();
            calculator.updateDisplay();
        });

        // Keyboard support
        document.addEventListener('keydown', event => {
            if (/[0-9]/.test(event.key)) {
                calculator.appendNumber(event.key);
                calculator.updateDisplay();
            } else if (event.key === '.') {
                calculator.appendNumber(event.key);
                calculator.updateDisplay();
            } else if (event.key === '+' || event.key === '-') {
                calculator.chooseOperation(event.key);
                calculator.updateDisplay();
            } else if (event.key === '*') {
                calculator.chooseOperation('×');
                calculator.updateDisplay();
            } else if (event.key === '/') {
                calculator.chooseOperation('÷');
                calculator.updateDisplay();
            } else if (event.key === 'Enter' || event.key === '=') {
                calculator.compute();
                calculator.updateDisplay();
            } else if (event.key === 'Escape') {
                calculator.clear();
                calculator.updateDisplay();
            } else if (event.key === 'Backspace') {
                calculator.delete();
                calculator.updateDisplay();
            }
        });