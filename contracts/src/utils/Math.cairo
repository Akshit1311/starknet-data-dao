use data_dao::utils::pow;

const LAMBDA: u256 = 1_00000000000000000_u256; // 0.1 * SCALE

// Exponential decay approximation: e^(-x)
fn fixed_exp_neg(x: u256) -> u256 {
    let scale = pow::ten_pow(18);
    let x2 = x * x / scale;
    let x3 = x2 * x / scale;

    let term1 = scale;                  // 1
    let term2 = x;                      // -x
    let term3 = x2 / 2_u256;            // + x^2 / 2
    let term4 = x3 / 6_u256;            // - x^3 / 6

    return term1 - term2 + term3 - term4;
}

// Calculate adjusted weight for a user
fn compute_adjusted_weight(order_count: u256, submission_index: u256) -> u256 {
    let scale = pow::ten_pow(18);
    let decay_input = LAMBDA * submission_index / scale;
    let decay = fixed_exp_neg(decay_input);
    let adjusted = order_count * decay / scale;
    return adjusted;
}

// Public function: calculate reward for a single user
pub fn calculate_reward(
    order_count: u256,
    submission_index: u256,
    total_adjusted_weight: u256,
    budget: u256
) -> u256 {
    let user_weight = compute_adjusted_weight(order_count, submission_index);
    let reward = user_weight * budget / total_adjusted_weight;
    return reward;
}
