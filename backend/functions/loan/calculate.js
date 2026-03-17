/**
 * 贷款计算器
 * 计算贷款月供、总利息、还款计划
 */

const { Response, Validator, Logger, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  const { 
    principal,        // 贷款本金（元）
    annualRate,       // 年利率（%）
    months,           // 贷款期限（月）
    repaymentType     // 还款方式：equal-principal-interest（等额本息）/ equal-principal（等额本金）/ interest-first（先息后本）
  } = event;
  
  try {
    // 验证用户身份
    const userInfo = getUserFromEvent(event);
    
    Logger.info('贷款计算请求', { 
      userId: userInfo?.userId, 
      principal, 
      annualRate, 
      months, 
      repaymentType 
    });

    // 参数验证
    const validation = Validator.validate(
      { principal, annualRate, months, repaymentType },
      {
        principal: { 
          required: true, 
          type: 'positiveNumber',
          validator: (v) => parseFloat(v) >= 1000 && parseFloat(v) <= 50000000 ? true : '贷款金额必须在1千-5000万之间'
        },
        annualRate: { 
          required: true, 
          type: 'number',
          validator: (v) => parseFloat(v) >= 0.1 && parseFloat(v) <= 36 ? true : '年利率必须在0.1%-36%之间'
        },
        months: { 
          required: true, 
          type: 'number',
          validator: (v) => [3, 6, 12, 18, 24, 36, 48, 60].includes(parseInt(v)) ? true : '贷款期限必须为3/6/12/18/24/36/48/60个月'
        },
        repaymentType: { 
          required: true,
          validator: (v) => ['equal-principal-interest', 'equal-principal', 'interest-first'].includes(v) ? true : '还款方式不正确'
        }
      }
    );

    if (!validation.valid) {
      return Response.error(400, validation.errors[0]);
    }

    // 转换参数
    const p = parseFloat(principal);
    const r = parseFloat(annualRate) / 100 / 12; // 月利率
    const n = parseInt(months);

    let result = {};

    switch (repaymentType) {
      case 'equal-principal-interest':
        result = calculateEqualPrincipalInterest(p, r, n);
        break;
      case 'equal-principal':
        result = calculateEqualPrincipal(p, r, n);
        break;
      case 'interest-first':
        result = calculateInterestFirst(p, r, n);
        break;
    }

    // 添加基础信息
    result.principal = p;
    result.annualRate = parseFloat(annualRate);
    result.months = n;
    result.repaymentType = repaymentType;
    result.repaymentTypeName = getRepaymentTypeName(repaymentType);

    Logger.info('贷款计算完成', { 
      principal: p, 
      totalInterest: result.totalInterest, 
      totalPayment: result.totalPayment 
    });

    return Response.success(result);

  } catch (error) {
    Logger.error('贷款计算异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};

/**
 * 等额本息计算
 * 每月还款金额固定
 */
function calculateEqualPrincipalInterest(principal, monthlyRate, months) {
  // 每月还款额 = [本金 × 月利率 × (1+月利率)^还款月数] ÷ [(1+月利率)^还款月数-1]
  const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                         (Math.pow(1 + monthlyRate, months) - 1);
  
  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;

  // 生成还款计划
  const schedule = [];
  let remainingPrincipal = principal;

  for (let i = 1; i <= months; i++) {
    const interest = remainingPrincipal * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    remainingPrincipal -= principalPayment;

    schedule.push({
      month: i,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      remainingPrincipal: Math.max(0, Math.round(remainingPrincipal * 100) / 100)
    });
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule: schedule.slice(0, 12) // 只返回前12个月的还款计划
  };
}

/**
 * 等额本金计算
 * 每月还款本金固定，利息递减
 */
function calculateEqualPrincipal(principal, monthlyRate, months) {
  const monthlyPrincipal = principal / months;
  
  let totalInterest = 0;
  const schedule = [];
  let remainingPrincipal = principal;

  for (let i = 1; i <= months; i++) {
    const interest = remainingPrincipal * monthlyRate;
    totalInterest += interest;
    
    const monthlyPayment = monthlyPrincipal + interest;
    remainingPrincipal -= monthlyPrincipal;

    schedule.push({
      month: i,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(monthlyPrincipal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      remainingPrincipal: Math.max(0, Math.round(remainingPrincipal * 100) / 100)
    });
  }

  return {
    firstMonthPayment: Math.round(schedule[0].payment * 100) / 100,
    lastMonthPayment: Math.round(schedule[schedule.length - 1].payment * 100) / 100,
    totalPayment: Math.round((principal + totalInterest) * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule: schedule.slice(0, 12)
  };
}

/**
 * 先息后本计算
 * 每月只还利息，到期还本金
 */
function calculateInterestFirst(principal, monthlyRate, months) {
  const monthlyInterest = principal * monthlyRate;
  const totalInterest = monthlyInterest * months;

  const schedule = [];
  
  for (let i = 1; i <= months; i++) {
    const isLast = i === months;
    schedule.push({
      month: i,
      payment: Math.round((monthlyInterest + (isLast ? principal : 0)) * 100) / 100,
      principal: isLast ? principal : 0,
      interest: Math.round(monthlyInterest * 100) / 100,
      remainingPrincipal: isLast ? 0 : principal
    });
  }

  return {
    monthlyInterest: Math.round(monthlyInterest * 100) / 100,
    totalPayment: Math.round((principal + totalInterest) * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule: schedule.slice(0, 12)
  };
}

/**
 * 获取还款方式名称
 */
function getRepaymentTypeName(type) {
  const names = {
    'equal-principal-interest': '等额本息',
    'equal-principal': '等额本金',
    'interest-first': '先息后本'
  };
  return names[type] || type;
}
