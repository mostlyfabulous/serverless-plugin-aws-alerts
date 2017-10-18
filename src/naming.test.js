'use strict';

const Naming = require('./naming');

describe('#naming', function () {
  describe('#getAlarmCloudFormationRef', () => {
    let naming = null;
    beforeEach(() => naming = new Naming());

    it('should get alarm name', () => {
      const expected = 'PrefixFunctionErrorsAlarm';
      const actual = naming.getAlarmCloudFormationRef('functionErrors', 'prefix');
      expect(actual).toEqual(expected);
    });
  });

  describe('#getLogMetricCloudFormationRef', () => {
    let naming = null;
    beforeEach(() => naming = new Naming());

    it('should get alarm name', () => {
      const expected = 'PrefixFunctionErrorsLogMetricFilter';
      const actual = naming.getLogMetricCloudFormationRef('Prefix', 'functionErrors');
      expect(actual).toEqual(expected);
    });
  });

  describe('#getPatternMetricName', () => {
    let naming = null;
    beforeEach(() => naming = new Naming());

    it('should get the pattern metric name', () => {
      const expected = 'MetricNamefoo';
      const actual = naming.getPatternMetricName('MetricName', 'foo');
      expect(actual).toEqual(expected);
    });
  });

  describe('#getAlarmName', () => {
    let naming = null;
    beforeEach(() => naming = new Naming());

    [true, false, undefined].forEach(stackNamePrefix => {
      const prefixDescription = stackNamePrefix === false ? '' : 'and prefix with stack name';
      it(`should interpolate alarm name ${prefixDescription}`, () => {
        const template = '$[functionName]-$[functionId]-$[metricName]-$[metricId]';
        const functionName = 'function';
        const functionLogicalId = 'functionId';
        const metricName = 'metric';
        const metricId = 'metricId';
        const stackName = 'fooservice-dev';
        const expectedPrefix = stackNamePrefix === false ? '' : `${stackName}-`;

        const expected = `${expectedPrefix}${functionName}-${functionLogicalId}-${metricName}-${metricId}`;
        const actual = naming.getAlarmName({ stackNamePrefix, template, functionName, functionLogicalId, metricName, metricId, stackName });

        expect(actual).toEqual(expected);
      });
    });

    it('should not prefix when $[stackName] is in the template', () => {
      const template = '$[functionName]-$[stackName]';
      const functionName = 'function';
      const stackName = 'fooservice-dev';

      const expected = `${functionName}-${stackName}`;
      const actual = naming.getAlarmName({ template, functionName, stackName });

      expect(actual).toEqual(expected);
    });
  });
});
