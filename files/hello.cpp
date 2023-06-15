#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/print.hpp>

namespace mycontract {
   using namespace std;
   using namespace eosio;

   class [[eosio::contract]] hello : public eosio::contract {
        using eosio::contract::contract;

        public:
            [[eosio::action]] void hi(name user) {
                print("Hi there, ", user.value, "!");
            }
   };
}