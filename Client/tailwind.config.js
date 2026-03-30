/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
       fontSize: {
        'xxl': '2.5rem',
        'icon-sm':'2.5rem'
      },
       screens: {
        'xs': '350px', // your custom breakpoint
      },
      colors: {
        'scsc-green': '#00A74A',
        'scsc-red': '#dc2626',
        'scsc-brown': '#822f1b',
        'sidebar':'#04111d',
        'sidebar-hover':'#185ea53f',
        'sidebar-active':'#185ea5'
    },
   fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'playfair':['Playfair Display','sans-serif']
      },
      backgroundColor:{
        'sidebar':'#04111d',
        'header-admin':'#041d11',
        'sidebar-hover':'#185ea53f',
        'sidebar-active':'#185ea5',
        
      }
  }
  },
  plugins: [],
}

