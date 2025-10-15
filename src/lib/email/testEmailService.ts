// Test script for email service
// Run this to test email functionality before deploying

import { emailService } from './emailService';

export async function testEmailService() {
  console.log('🧪 Testing Email Service...');
  
  try {
    // Test email confirmation
    const testEmail = 'test@example.com';
    const testUrl = 'https://crepephahonyothin35.netlify.app/#confirm?token=test123';
    
    console.log('📧 Sending test confirmation email...');
    const result = await emailService.sendEmailConfirmation(testEmail, testUrl);
    
    if (result) {
      console.log('✅ Email service test PASSED');
      console.log('📧 Test email sent to:', testEmail);
      console.log('🔗 Confirmation URL:', testUrl);
    } else {
      console.log('❌ Email service test FAILED');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Email service test ERROR:', error);
    return false;
  }
}

// Test order confirmation
export async function testOrderConfirmation() {
  console.log('🧪 Testing Order Confirmation...');
  
  try {
    const testEmail = 'test@example.com';
    const testOrder = {
      id: 'TEST-123',
      total: 150,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };
    
    console.log('📧 Sending test order confirmation...');
    const result = await emailService.sendOrderConfirmation(testEmail, testOrder);
    
    if (result) {
      console.log('✅ Order confirmation test PASSED');
      console.log('📧 Test order email sent to:', testEmail);
      console.log('📦 Order details:', testOrder);
    } else {
      console.log('❌ Order confirmation test FAILED');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Order confirmation test ERROR:', error);
    return false;
  }
}

// Run all tests
export async function runAllEmailTests() {
  console.log('🚀 Starting Email Service Tests...');
  console.log('================================');
  
  const confirmationTest = await testEmailService();
  console.log('');
  const orderTest = await testOrderConfirmation();
  
  console.log('');
  console.log('📊 Test Results:');
  console.log('================');
  console.log('✅ Confirmation Email:', confirmationTest ? 'PASSED' : 'FAILED');
  console.log('✅ Order Confirmation:', orderTest ? 'PASSED' : 'FAILED');
  
  if (confirmationTest && orderTest) {
    console.log('🎉 All email tests PASSED!');
    return true;
  } else {
    console.log('❌ Some email tests FAILED');
    return false;
  }
}
