describe('spy basics and call arguments: called, calledOnce, calledWith, calledWithExactly, calledOnceWith etc.', () => {
  it('basic', async () => {
    const obj = {
      foo() {
        return 'yo'
      },
    }

    const spy = jest.spyOn(obj, 'foo')

    obj.foo()

    // assert against the spy directly
    expect(spy).toHaveBeenCalled()
  })

  it('spies can retry with the Jest api', async () => {
    const obj2 = {
      foo() {
        return 'yo'
      },
    }

    const spy = jest.spyOn(obj2, 'foo')

    setTimeout(() => {
      return obj2.foo()
    }, 50)

    setTimeout(() => {
      return obj2.foo()
    }, 100)

    // KEY difference with Jest: we have to wait for the asynchronous operations to finish before the assertions
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('checking the call arguments: called, calledOnce, calledWith, calledWithExactly, calledOnceWith', async () => {
    type Person = {
      name?: string
      last?: string
      setName: (first: string, last: string) => void
    }

    const person: Person = {
      setName(first: string, last: string) {
        this.name = first + ' ' + last
      },
    }

    const spy = jest.spyOn(person, 'setName')

    // simulate the application calling the method after some random delay
    setTimeout(() => {
      return person.setName('John', 'Doe')
    }, Math.random() * 100)

    // KEY difference with Jest: We have to wait for the asynchronous operations to finish before the assertions
    await new Promise(resolve => setTimeout(resolve, 150))

    // check if the spy was called
    expect(spy).toHaveBeenCalled()
    // called once
    expect(spy).toHaveBeenCalledTimes(1)
    // called with specific arguments
    expect(spy).toHaveBeenCalledWith('John', 'Doe')
    // called with exactly specific arguments
    expect(spy).toHaveBeenCalledWith('John', 'Doe')
    // check if the spy was called once with a string and "Doe"
    expect(spy).toHaveBeenCalledWith(expect.any(String), 'Doe')
    expect(spy).toHaveBeenCalledWith('John', expect.any(String))

    // verify the property was set
    expect(person).toHaveProperty('name', 'John Doe')
  })
})

describe("matchers: match.type, match(predicate, 'optional-message'), match.in([...])", () => {
  it('call args with jest matchers', () => {
    const calculator = {
      add(a: number, b: number) {
        return a + b
      },
    }

    const spy = jest.spyOn(calculator, 'add')

    calculator.add(2, 3)

    // if we want to assert the exact values used during the call
    expect(spy).toHaveBeenCalledWith(2, 3)
    // confirm that the method was called with two numbers
    expect(spy).toHaveBeenCalledWith(expect.any(Number), expect.any(Number))
    // match any value
    expect(spy).toHaveBeenCalledWith(expect.anything(), 3)

    // Custom matcher to assert the value to pass a custom predicate function
    const isEven = (x: number) => x % 2 === 0
    const isOdd = (x: number) => x % 2 === 1

    // A custom matcher for Jest can be created using expect.extend (very gnarly)
    expect.extend({
      toBeEven(received) {
        const pass = isEven(received)
        if (pass) {
          return {
            message: () => `expected ${received} not to be an even number`,
            pass: true,
          }
        } else {
          return {
            message: () => `expected ${received} to be an even number`,
            pass: false,
          }
        }
      },
      toBeOdd(received) {
        const pass = isOdd(received)
        if (pass) {
          return {
            message: () => `expected ${received} not to be an odd number`,
            pass: true,
          }
        } else {
          return {
            message: () => `expected ${received} to be an odd number`,
            pass: false,
          }
        }
      },
    })

    // use the custom matcher
    // @ts-expect-error: TS doesn't know about custom matchers we just created
    expect(spy.mock.calls[0][0]).toBeEven()
    // @ts-expect-error: TS doesn't know about custom matchers we just created
    expect(spy.mock.calls[0][1]).toBeOdd()

    // the other 2 comparable custom matchers are not even worth getting into...

    // cleanup
  })

  describe("call count & promises: have.been.calledThrice, its('callCount).should('eq', 4), invoke('resetHistory'), for promises: .its('returnValues')", () => {
    it('call count 2nd example', () => {
      const person = {
        age: 0,
        birthday() {
          this.age += 1
        },
      }

      const spy = jest.spyOn(person, 'birthday')

      expect(person.age).toBe(0)

      person.birthday()
      person.birthday()

      expect(spy).toHaveBeenCalledTimes(2)
      expect(person.age).toBe(2)

      person.birthday()
      person.birthday()

      expect(spy).toHaveBeenCalledTimes(4)

      spy.mockReset()

      expect(spy).not.toHaveBeenCalled()
    })

    it('resolved value (promises)', async () => {
      const calc = {
        async add(a: number, b: number) {
          return a + b
        },
      }

      const spy = jest.spyOn(calc, 'add')

      // Let's gather the promises first
      const promises = [calc.add(4, 5), calc.add(1, 90), calc.add(-5, -8)]

      // Now we wait for all the promises to resolve
      const results = await Promise.all(promises)

      // We can check if the spy was called with the correct arguments at each call
      expect(spy).toHaveBeenNthCalledWith(1, 4, 5)
      expect(spy).toHaveBeenNthCalledWith(2, 1, 90)
      expect(spy).toHaveBeenNthCalledWith(3, -5, -8)

      // Finally, we can verify the resolved values
      expect(results).toEqual([9, 91, -13])
    })

    it('call the spy from the test', () => {
      const testRunner = {
        name: 'Cypress',
        getName() {
          return this.name
        },
      }

      const getNameSpy = jest.spyOn(testRunner, 'getName')

      expect(typeof getNameSpy).toBe('function')

      expect(testRunner.getName()).toBe('Cypress')
      expect(getNameSpy).toHaveBeenCalled()

      // @ts-expect-error: no bind method
      expect(getNameSpy.bind(testRunner)()).toBe('Cypress')
      expect(getNameSpy).toHaveBeenCalledTimes(2)
    })
  })
})

// the rest does not translate well into Jest
