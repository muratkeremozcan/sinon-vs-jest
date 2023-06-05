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

    // Clean up the spy
    spy.mockRestore()
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

    // We have to wait for the asynchronous operations to finish before the assertions
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

    // We have to wait for the asynchronous operations to finish before the assertions
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
