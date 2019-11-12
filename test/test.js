import createMatcher from '../dist/router.min.js'
import { expect } from 'chai'

describe('routing', function() {
  const match = createMatcher({
    '/simple': 'simple',
    '/trailing/': 'trailing',
    '/single/:first': 'single',
    '/multiple/:first/:second': 'multiple',
    '/optional/:first(/:second)': 'optional',
    '/mixed/:first/literal/:second': 'mixed',
    '/wildcard/*': 'wildcard',
  })

  it('should return null for failed match', function() {
    const result = match('/not-defined')
    expect(result).to.null
  })

  it('should match simple url', function() {
    const result = match('/simple')
    expect(result).to.deep.equal({ page: 'simple', params: {} })
  })

  it('should not match trailing slash', function() {
    const result = match('/simple/')
    expect(result).to.null
  })

  it('should match explicit trailing slash', function() {
    const result = match('/trailing/')
    expect(result).to.deep.equal({ page: 'trailing', params: {} })
  })

  it('should match named parameter', function() {
    const result = match('/single/one')
    expect(result).to.deep.equal({ page: 'single', params: { first: 'one' } })
  })

  it('should match multiple named parameters', function() {
    const result = match('/multiple/one/two')
    expect(result).to.deep.equal({ page: 'multiple', params: { first: 'one', second: 'two' } })
  })

  it('should not match missing parameter', function() {
    const result = match('/multiple/one')
    expect(result).to.null
  })

  it('should match optional supplied parameter', function() {
    const result = match('/optional/one/two')
    expect(result).to.deep.equal({ page: 'optional', params: { first: 'one', second: 'two' } })
  })

  it('should match with missing optional parameter', function() {
    const result = match('/optional/one')
    expect(result).to.deep.equal({ page: 'optional', params: { first: 'one' } })
  })

  it('should match with mixed parameters and literals', function() {
    const result = match('/mixed/one/literal/two')
    expect(result).to.deep.equal({ page: 'mixed', params: { first: 'one', second: 'two' } })
  })

  it('should not match if mixed literals differ', function() {
    const result = match('/mixed/one/unknown/two')
    expect(result).to.null
  })

  it('should match wildcard with empty path', function() {
    const result = match('/wildcard/')
    expect(result).to.deep.equal({ page: 'wildcard', params: { path: '' } })
  })

  it('should match wildcard with single segment path', function() {
    const result = match('/wildcard/one')
    expect(result).to.deep.equal({ page: 'wildcard', params: { path: 'one' } })
  })

  it('should match wildcard with multi-segment path', function() {
    const result = match('/wildcard/one/two/three')
    expect(result).to.deep.equal({ page: 'wildcard', params: { path: 'one/two/three' } })
  })
})