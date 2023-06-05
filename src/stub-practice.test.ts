//  jest.spyOn().mockImplementation() provides more flexibility if you need to access the original method
//  or control the implementation in a more detailed way.
// However, for simpler cases, using jest.fn() alone can suffice.
// jest.fn() is used to create a standalone mock function,
// while jest.spyOn(...).mockImplementation is used to spy on an existing object or module
// and provide a custom implementation for a specific method.

// In Sinon, the equivalent function is sinon.stub().
// Both jest.fn() and sinon.stub() serve the same purpose of creating mock functions.
// In Jest, you can use .mockImplementation() to provide a custom implementation for the mock function.
// In Sinon, you can use .callsFake() or .returns() to specify custom behavior for the stub.

// jest.fn() can be used more in scenarios where you're not spying on or modifying existing object methods
// but rather creating standalone mock functions.
// For instance, when testing if a function passed as a prop or callback is called correctly in a component test
// or when needing to create a mock implementation for a function from a module that your function under test is calling.
// Here is an example scenario where jest.fn() could be used
describe('standalone function', () => {
  it('should call the callback', () => {
    const mockCallback = jest.fn()

    function doSomething(callback: (arg: string) => void) {
      callback('test argument')
    }

    doSomething(mockCallback)

    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith('test argument')
  })
})

describe("stub basics: onCall(), onFirstCall(), onSecondCall(), .returns(..), throws(...), invoke('restore')", () => {
  it('replace a function', () => {
    const obj = {
      foo(a: string, b: string) {
        return `a, ${a}, b, ${b}`
      },
    }

    const stub = jest.spyOn(obj, 'foo').mockImplementation(jest.fn())
    obj.foo('foo', 'bar')

    expect(stub).toHaveBeenCalledWith('foo', 'bar')
    expect(stub).toHaveBeenCalledTimes(1)
  })

  it('1:1 use with spy', () => {
    const obj = {
      foo() {},
    }

    const stub = jest.spyOn(obj, 'foo')
    obj.foo()

    expect(stub).toHaveBeenCalled()
    expect(stub).toHaveBeenCalledTimes(1)
  })

  it('restore the original method, when you no longer want to use the stub', () => {
    const person = {
      getName() {
        return 'Joe'
      },
    }

    expect(person.getName()).toBe('Joe')

    const stub = jest.spyOn(person, 'getName').mockReturnValue('Cliff')
    expect(person.getName()).toBe('Cliff')

    // restore the original method
    stub.mockRestore()
    expect(person.getName()).toBe('Joe')
  })
})

describe('matchers: .mockImplementation(), .toHaveBeenCalledWith()', () => {
  it('Matching stub depending on arguments', () => {
    const greeter = {
      greet(name: string | number) {
        return `Hello, ${name}!`
      },
    }

    // there is no direct equivalent in Jest, but the below does the same thing
    jest
      .spyOn(greeter, 'greet')
      .mockImplementation((name: string | number | undefined) => {
        if (typeof name === 'string') {
          return 'Hi, Joe!'
        } else if (typeof name === 'number') {
          throw new Error('Invalid name')
        } else {
          return 'Hello, undefined!'
        }
      })

    expect(greeter.greet('World')).toEqual('Hi, Joe!')
    expect(() => greeter.greet(42)).toThrow('Invalid name')
    expect(greeter.greet).toHaveBeenCalledTimes(2)

    // @ts-expect-error: no arg
    expect(greeter.greet()).toEqual('Hello, undefined!')
  })
})

describe('Call the original method from the stub: mockImplementation(), originalName', () => {
  it('Sometimes you might want to call the original method from the stub and modify it', () => {
    const person = {
      getName() {
        return 'Joe'
      },
    }

    // there is no direct equivalent in Jest, but the below does the same thing
    const originalGetName = person.getName.bind(person)

    jest.spyOn(person, 'getName').mockImplementation(() => {
      return originalGetName().split('').reverse().join('')
    })

    expect(person.getName()).toEqual('eoJ')
  })
})

describe('cy.clock', () => {
  it('control the time in the browser', () => {
    jest.useFakeTimers()
    const specNow = new Date()
    const now = new Date(Date.UTC(2017, 2, 14)).getTime()

    jest.setSystemTime(now)

    // application time is frozen
    const appNow = new Date()
    expect(appNow.getTime()).toBe(now)
    expect(appNow.getTime()).toBe(1489449600000) // the timestamp in milliseconds

    // we can advance the application clock by 5 seconds
    jest.advanceTimersByTime(5000)
    const appNow2 = new Date()
    expect(appNow2.getTime()).toBe(1489449605000)

    // spec clock only advanced by probably less than 200ms
    const specNow3 = new Date()
    expect(specNow3.getTime()).toBeLessThan(specNow.getTime() + 200)

    jest.useRealTimers()
  })
})
