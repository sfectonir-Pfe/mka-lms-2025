
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Formateur
 * 
 */
export type Formateur = $Result.DefaultSelection<Prisma.$FormateurPayload>
/**
 * Model Etudiant
 * 
 */
export type Etudiant = $Result.DefaultSelection<Prisma.$EtudiantPayload>
/**
 * Model CreateurDeFormation
 * 
 */
export type CreateurDeFormation = $Result.DefaultSelection<Prisma.$CreateurDeFormationPayload>
/**
 * Model Admin
 * 
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>
/**
 * Model Etablissement
 * 
 */
export type Etablissement = $Result.DefaultSelection<Prisma.$EtablissementPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  Etudiant: 'Etudiant',
  Formateur: 'Formateur',
  Admin: 'Admin',
  CreateurDeFormation: 'CreateurDeFormation',
  Etablissement: 'Etablissement'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.formateur`: Exposes CRUD operations for the **Formateur** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Formateurs
    * const formateurs = await prisma.formateur.findMany()
    * ```
    */
  get formateur(): Prisma.FormateurDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.etudiant`: Exposes CRUD operations for the **Etudiant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Etudiants
    * const etudiants = await prisma.etudiant.findMany()
    * ```
    */
  get etudiant(): Prisma.EtudiantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.createurDeFormation`: Exposes CRUD operations for the **CreateurDeFormation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CreateurDeFormations
    * const createurDeFormations = await prisma.createurDeFormation.findMany()
    * ```
    */
  get createurDeFormation(): Prisma.CreateurDeFormationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admin.findMany()
    * ```
    */
  get admin(): Prisma.AdminDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.etablissement`: Exposes CRUD operations for the **Etablissement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Etablissements
    * const etablissements = await prisma.etablissement.findMany()
    * ```
    */
  get etablissement(): Prisma.EtablissementDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Formateur: 'Formateur',
    Etudiant: 'Etudiant',
    CreateurDeFormation: 'CreateurDeFormation',
    Admin: 'Admin',
    Etablissement: 'Etablissement'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "formateur" | "etudiant" | "createurDeFormation" | "admin" | "etablissement"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Formateur: {
        payload: Prisma.$FormateurPayload<ExtArgs>
        fields: Prisma.FormateurFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FormateurFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FormateurFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload>
          }
          findFirst: {
            args: Prisma.FormateurFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FormateurFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload>
          }
          findMany: {
            args: Prisma.FormateurFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload>[]
          }
          create: {
            args: Prisma.FormateurCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload>
          }
          createMany: {
            args: Prisma.FormateurCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FormateurCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload>[]
          }
          delete: {
            args: Prisma.FormateurDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload>
          }
          update: {
            args: Prisma.FormateurUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload>
          }
          deleteMany: {
            args: Prisma.FormateurDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FormateurUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FormateurUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload>[]
          }
          upsert: {
            args: Prisma.FormateurUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormateurPayload>
          }
          aggregate: {
            args: Prisma.FormateurAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFormateur>
          }
          groupBy: {
            args: Prisma.FormateurGroupByArgs<ExtArgs>
            result: $Utils.Optional<FormateurGroupByOutputType>[]
          }
          count: {
            args: Prisma.FormateurCountArgs<ExtArgs>
            result: $Utils.Optional<FormateurCountAggregateOutputType> | number
          }
        }
      }
      Etudiant: {
        payload: Prisma.$EtudiantPayload<ExtArgs>
        fields: Prisma.EtudiantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EtudiantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EtudiantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload>
          }
          findFirst: {
            args: Prisma.EtudiantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EtudiantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload>
          }
          findMany: {
            args: Prisma.EtudiantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload>[]
          }
          create: {
            args: Prisma.EtudiantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload>
          }
          createMany: {
            args: Prisma.EtudiantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EtudiantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload>[]
          }
          delete: {
            args: Prisma.EtudiantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload>
          }
          update: {
            args: Prisma.EtudiantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload>
          }
          deleteMany: {
            args: Prisma.EtudiantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EtudiantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EtudiantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload>[]
          }
          upsert: {
            args: Prisma.EtudiantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtudiantPayload>
          }
          aggregate: {
            args: Prisma.EtudiantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEtudiant>
          }
          groupBy: {
            args: Prisma.EtudiantGroupByArgs<ExtArgs>
            result: $Utils.Optional<EtudiantGroupByOutputType>[]
          }
          count: {
            args: Prisma.EtudiantCountArgs<ExtArgs>
            result: $Utils.Optional<EtudiantCountAggregateOutputType> | number
          }
        }
      }
      CreateurDeFormation: {
        payload: Prisma.$CreateurDeFormationPayload<ExtArgs>
        fields: Prisma.CreateurDeFormationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CreateurDeFormationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CreateurDeFormationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload>
          }
          findFirst: {
            args: Prisma.CreateurDeFormationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CreateurDeFormationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload>
          }
          findMany: {
            args: Prisma.CreateurDeFormationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload>[]
          }
          create: {
            args: Prisma.CreateurDeFormationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload>
          }
          createMany: {
            args: Prisma.CreateurDeFormationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CreateurDeFormationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload>[]
          }
          delete: {
            args: Prisma.CreateurDeFormationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload>
          }
          update: {
            args: Prisma.CreateurDeFormationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload>
          }
          deleteMany: {
            args: Prisma.CreateurDeFormationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CreateurDeFormationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CreateurDeFormationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload>[]
          }
          upsert: {
            args: Prisma.CreateurDeFormationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreateurDeFormationPayload>
          }
          aggregate: {
            args: Prisma.CreateurDeFormationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCreateurDeFormation>
          }
          groupBy: {
            args: Prisma.CreateurDeFormationGroupByArgs<ExtArgs>
            result: $Utils.Optional<CreateurDeFormationGroupByOutputType>[]
          }
          count: {
            args: Prisma.CreateurDeFormationCountArgs<ExtArgs>
            result: $Utils.Optional<CreateurDeFormationCountAggregateOutputType> | number
          }
        }
      }
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>
        fields: Prisma.AdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin>
          }
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>
            result: $Utils.Optional<AdminCountAggregateOutputType> | number
          }
        }
      }
      Etablissement: {
        payload: Prisma.$EtablissementPayload<ExtArgs>
        fields: Prisma.EtablissementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EtablissementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EtablissementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload>
          }
          findFirst: {
            args: Prisma.EtablissementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EtablissementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload>
          }
          findMany: {
            args: Prisma.EtablissementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload>[]
          }
          create: {
            args: Prisma.EtablissementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload>
          }
          createMany: {
            args: Prisma.EtablissementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EtablissementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload>[]
          }
          delete: {
            args: Prisma.EtablissementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload>
          }
          update: {
            args: Prisma.EtablissementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload>
          }
          deleteMany: {
            args: Prisma.EtablissementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EtablissementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EtablissementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload>[]
          }
          upsert: {
            args: Prisma.EtablissementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EtablissementPayload>
          }
          aggregate: {
            args: Prisma.EtablissementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEtablissement>
          }
          groupBy: {
            args: Prisma.EtablissementGroupByArgs<ExtArgs>
            result: $Utils.Optional<EtablissementGroupByOutputType>[]
          }
          count: {
            args: Prisma.EtablissementCountArgs<ExtArgs>
            result: $Utils.Optional<EtablissementCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    formateur?: FormateurOmit
    etudiant?: EtudiantOmit
    createurDeFormation?: CreateurDeFormationOmit
    admin?: AdminOmit
    etablissement?: EtablissementOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    formateurs: number
    Etudiants: number
    CreateursDeFormations: number
    Admins: number
    Etablissements: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    formateurs?: boolean | UserCountOutputTypeCountFormateursArgs
    Etudiants?: boolean | UserCountOutputTypeCountEtudiantsArgs
    CreateursDeFormations?: boolean | UserCountOutputTypeCountCreateursDeFormationsArgs
    Admins?: boolean | UserCountOutputTypeCountAdminsArgs
    Etablissements?: boolean | UserCountOutputTypeCountEtablissementsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFormateursArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FormateurWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEtudiantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EtudiantWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreateursDeFormationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CreateurDeFormationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAdminsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEtablissementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EtablissementWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    role: $Enums.Role | null
    email: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
    resetToken: string | null
    resetTokenExpiry: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    role: $Enums.Role | null
    email: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
    resetToken: string | null
    resetTokenExpiry: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    role: number
    email: number
    password: number
    createdAt: number
    updatedAt: number
    resetToken: number
    resetTokenExpiry: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    role?: true
    email?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    resetToken?: true
    resetTokenExpiry?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    role?: true
    email?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    resetToken?: true
    resetTokenExpiry?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    role?: true
    email?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    resetToken?: true
    resetTokenExpiry?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    role: $Enums.Role
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
    resetToken: string
    resetTokenExpiry: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
    formateurs?: boolean | User$formateursArgs<ExtArgs>
    Etudiants?: boolean | User$EtudiantsArgs<ExtArgs>
    CreateursDeFormations?: boolean | User$CreateursDeFormationsArgs<ExtArgs>
    Admins?: boolean | User$AdminsArgs<ExtArgs>
    Etablissements?: boolean | User$EtablissementsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    role?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role" | "email" | "password" | "createdAt" | "updatedAt" | "resetToken" | "resetTokenExpiry", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    formateurs?: boolean | User$formateursArgs<ExtArgs>
    Etudiants?: boolean | User$EtudiantsArgs<ExtArgs>
    CreateursDeFormations?: boolean | User$CreateursDeFormationsArgs<ExtArgs>
    Admins?: boolean | User$AdminsArgs<ExtArgs>
    Etablissements?: boolean | User$EtablissementsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      formateurs: Prisma.$FormateurPayload<ExtArgs>[]
      Etudiants: Prisma.$EtudiantPayload<ExtArgs>[]
      CreateursDeFormations: Prisma.$CreateurDeFormationPayload<ExtArgs>[]
      Admins: Prisma.$AdminPayload<ExtArgs>[]
      Etablissements: Prisma.$EtablissementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      role: $Enums.Role
      email: string
      password: string
      createdAt: Date
      updatedAt: Date
      resetToken: string
      resetTokenExpiry: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    formateurs<T extends User$formateursArgs<ExtArgs> = {}>(args?: Subset<T, User$formateursArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Etudiants<T extends User$EtudiantsArgs<ExtArgs> = {}>(args?: Subset<T, User$EtudiantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    CreateursDeFormations<T extends User$CreateursDeFormationsArgs<ExtArgs> = {}>(args?: Subset<T, User$CreateursDeFormationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Admins<T extends User$AdminsArgs<ExtArgs> = {}>(args?: Subset<T, User$AdminsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Etablissements<T extends User$EtablissementsArgs<ExtArgs> = {}>(args?: Subset<T, User$EtablissementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly role: FieldRef<"User", 'Role'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly resetToken: FieldRef<"User", 'String'>
    readonly resetTokenExpiry: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.formateurs
   */
  export type User$formateursArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
    where?: FormateurWhereInput
    orderBy?: FormateurOrderByWithRelationInput | FormateurOrderByWithRelationInput[]
    cursor?: FormateurWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FormateurScalarFieldEnum | FormateurScalarFieldEnum[]
  }

  /**
   * User.Etudiants
   */
  export type User$EtudiantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
    where?: EtudiantWhereInput
    orderBy?: EtudiantOrderByWithRelationInput | EtudiantOrderByWithRelationInput[]
    cursor?: EtudiantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EtudiantScalarFieldEnum | EtudiantScalarFieldEnum[]
  }

  /**
   * User.CreateursDeFormations
   */
  export type User$CreateursDeFormationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
    where?: CreateurDeFormationWhereInput
    orderBy?: CreateurDeFormationOrderByWithRelationInput | CreateurDeFormationOrderByWithRelationInput[]
    cursor?: CreateurDeFormationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CreateurDeFormationScalarFieldEnum | CreateurDeFormationScalarFieldEnum[]
  }

  /**
   * User.Admins
   */
  export type User$AdminsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    cursor?: AdminWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * User.Etablissements
   */
  export type User$EtablissementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
    where?: EtablissementWhereInput
    orderBy?: EtablissementOrderByWithRelationInput | EtablissementOrderByWithRelationInput[]
    cursor?: EtablissementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EtablissementScalarFieldEnum | EtablissementScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Formateur
   */

  export type AggregateFormateur = {
    _count: FormateurCountAggregateOutputType | null
    _avg: FormateurAvgAggregateOutputType | null
    _sum: FormateurSumAggregateOutputType | null
    _min: FormateurMinAggregateOutputType | null
    _max: FormateurMaxAggregateOutputType | null
  }

  export type FormateurAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type FormateurSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type FormateurMinAggregateOutputType = {
    id: number | null
    speciality: string | null
    userId: number | null
  }

  export type FormateurMaxAggregateOutputType = {
    id: number | null
    speciality: string | null
    userId: number | null
  }

  export type FormateurCountAggregateOutputType = {
    id: number
    speciality: number
    userId: number
    _all: number
  }


  export type FormateurAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type FormateurSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type FormateurMinAggregateInputType = {
    id?: true
    speciality?: true
    userId?: true
  }

  export type FormateurMaxAggregateInputType = {
    id?: true
    speciality?: true
    userId?: true
  }

  export type FormateurCountAggregateInputType = {
    id?: true
    speciality?: true
    userId?: true
    _all?: true
  }

  export type FormateurAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Formateur to aggregate.
     */
    where?: FormateurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Formateurs to fetch.
     */
    orderBy?: FormateurOrderByWithRelationInput | FormateurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FormateurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Formateurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Formateurs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Formateurs
    **/
    _count?: true | FormateurCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FormateurAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FormateurSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FormateurMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FormateurMaxAggregateInputType
  }

  export type GetFormateurAggregateType<T extends FormateurAggregateArgs> = {
        [P in keyof T & keyof AggregateFormateur]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFormateur[P]>
      : GetScalarType<T[P], AggregateFormateur[P]>
  }




  export type FormateurGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FormateurWhereInput
    orderBy?: FormateurOrderByWithAggregationInput | FormateurOrderByWithAggregationInput[]
    by: FormateurScalarFieldEnum[] | FormateurScalarFieldEnum
    having?: FormateurScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FormateurCountAggregateInputType | true
    _avg?: FormateurAvgAggregateInputType
    _sum?: FormateurSumAggregateInputType
    _min?: FormateurMinAggregateInputType
    _max?: FormateurMaxAggregateInputType
  }

  export type FormateurGroupByOutputType = {
    id: number
    speciality: string
    userId: number
    _count: FormateurCountAggregateOutputType | null
    _avg: FormateurAvgAggregateOutputType | null
    _sum: FormateurSumAggregateOutputType | null
    _min: FormateurMinAggregateOutputType | null
    _max: FormateurMaxAggregateOutputType | null
  }

  type GetFormateurGroupByPayload<T extends FormateurGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FormateurGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FormateurGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FormateurGroupByOutputType[P]>
            : GetScalarType<T[P], FormateurGroupByOutputType[P]>
        }
      >
    >


  export type FormateurSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    speciality?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["formateur"]>

  export type FormateurSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    speciality?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["formateur"]>

  export type FormateurSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    speciality?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["formateur"]>

  export type FormateurSelectScalar = {
    id?: boolean
    speciality?: boolean
    userId?: boolean
  }

  export type FormateurOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "speciality" | "userId", ExtArgs["result"]["formateur"]>
  export type FormateurInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FormateurIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FormateurIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FormateurPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Formateur"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      speciality: string
      userId: number
    }, ExtArgs["result"]["formateur"]>
    composites: {}
  }

  type FormateurGetPayload<S extends boolean | null | undefined | FormateurDefaultArgs> = $Result.GetResult<Prisma.$FormateurPayload, S>

  type FormateurCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FormateurFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FormateurCountAggregateInputType | true
    }

  export interface FormateurDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Formateur'], meta: { name: 'Formateur' } }
    /**
     * Find zero or one Formateur that matches the filter.
     * @param {FormateurFindUniqueArgs} args - Arguments to find a Formateur
     * @example
     * // Get one Formateur
     * const formateur = await prisma.formateur.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FormateurFindUniqueArgs>(args: SelectSubset<T, FormateurFindUniqueArgs<ExtArgs>>): Prisma__FormateurClient<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Formateur that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FormateurFindUniqueOrThrowArgs} args - Arguments to find a Formateur
     * @example
     * // Get one Formateur
     * const formateur = await prisma.formateur.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FormateurFindUniqueOrThrowArgs>(args: SelectSubset<T, FormateurFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FormateurClient<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Formateur that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormateurFindFirstArgs} args - Arguments to find a Formateur
     * @example
     * // Get one Formateur
     * const formateur = await prisma.formateur.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FormateurFindFirstArgs>(args?: SelectSubset<T, FormateurFindFirstArgs<ExtArgs>>): Prisma__FormateurClient<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Formateur that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormateurFindFirstOrThrowArgs} args - Arguments to find a Formateur
     * @example
     * // Get one Formateur
     * const formateur = await prisma.formateur.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FormateurFindFirstOrThrowArgs>(args?: SelectSubset<T, FormateurFindFirstOrThrowArgs<ExtArgs>>): Prisma__FormateurClient<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Formateurs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormateurFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Formateurs
     * const formateurs = await prisma.formateur.findMany()
     * 
     * // Get first 10 Formateurs
     * const formateurs = await prisma.formateur.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const formateurWithIdOnly = await prisma.formateur.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FormateurFindManyArgs>(args?: SelectSubset<T, FormateurFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Formateur.
     * @param {FormateurCreateArgs} args - Arguments to create a Formateur.
     * @example
     * // Create one Formateur
     * const Formateur = await prisma.formateur.create({
     *   data: {
     *     // ... data to create a Formateur
     *   }
     * })
     * 
     */
    create<T extends FormateurCreateArgs>(args: SelectSubset<T, FormateurCreateArgs<ExtArgs>>): Prisma__FormateurClient<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Formateurs.
     * @param {FormateurCreateManyArgs} args - Arguments to create many Formateurs.
     * @example
     * // Create many Formateurs
     * const formateur = await prisma.formateur.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FormateurCreateManyArgs>(args?: SelectSubset<T, FormateurCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Formateurs and returns the data saved in the database.
     * @param {FormateurCreateManyAndReturnArgs} args - Arguments to create many Formateurs.
     * @example
     * // Create many Formateurs
     * const formateur = await prisma.formateur.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Formateurs and only return the `id`
     * const formateurWithIdOnly = await prisma.formateur.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FormateurCreateManyAndReturnArgs>(args?: SelectSubset<T, FormateurCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Formateur.
     * @param {FormateurDeleteArgs} args - Arguments to delete one Formateur.
     * @example
     * // Delete one Formateur
     * const Formateur = await prisma.formateur.delete({
     *   where: {
     *     // ... filter to delete one Formateur
     *   }
     * })
     * 
     */
    delete<T extends FormateurDeleteArgs>(args: SelectSubset<T, FormateurDeleteArgs<ExtArgs>>): Prisma__FormateurClient<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Formateur.
     * @param {FormateurUpdateArgs} args - Arguments to update one Formateur.
     * @example
     * // Update one Formateur
     * const formateur = await prisma.formateur.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FormateurUpdateArgs>(args: SelectSubset<T, FormateurUpdateArgs<ExtArgs>>): Prisma__FormateurClient<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Formateurs.
     * @param {FormateurDeleteManyArgs} args - Arguments to filter Formateurs to delete.
     * @example
     * // Delete a few Formateurs
     * const { count } = await prisma.formateur.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FormateurDeleteManyArgs>(args?: SelectSubset<T, FormateurDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Formateurs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormateurUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Formateurs
     * const formateur = await prisma.formateur.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FormateurUpdateManyArgs>(args: SelectSubset<T, FormateurUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Formateurs and returns the data updated in the database.
     * @param {FormateurUpdateManyAndReturnArgs} args - Arguments to update many Formateurs.
     * @example
     * // Update many Formateurs
     * const formateur = await prisma.formateur.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Formateurs and only return the `id`
     * const formateurWithIdOnly = await prisma.formateur.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FormateurUpdateManyAndReturnArgs>(args: SelectSubset<T, FormateurUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Formateur.
     * @param {FormateurUpsertArgs} args - Arguments to update or create a Formateur.
     * @example
     * // Update or create a Formateur
     * const formateur = await prisma.formateur.upsert({
     *   create: {
     *     // ... data to create a Formateur
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Formateur we want to update
     *   }
     * })
     */
    upsert<T extends FormateurUpsertArgs>(args: SelectSubset<T, FormateurUpsertArgs<ExtArgs>>): Prisma__FormateurClient<$Result.GetResult<Prisma.$FormateurPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Formateurs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormateurCountArgs} args - Arguments to filter Formateurs to count.
     * @example
     * // Count the number of Formateurs
     * const count = await prisma.formateur.count({
     *   where: {
     *     // ... the filter for the Formateurs we want to count
     *   }
     * })
    **/
    count<T extends FormateurCountArgs>(
      args?: Subset<T, FormateurCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FormateurCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Formateur.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormateurAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FormateurAggregateArgs>(args: Subset<T, FormateurAggregateArgs>): Prisma.PrismaPromise<GetFormateurAggregateType<T>>

    /**
     * Group by Formateur.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormateurGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FormateurGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FormateurGroupByArgs['orderBy'] }
        : { orderBy?: FormateurGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FormateurGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFormateurGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Formateur model
   */
  readonly fields: FormateurFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Formateur.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FormateurClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Formateur model
   */
  interface FormateurFieldRefs {
    readonly id: FieldRef<"Formateur", 'Int'>
    readonly speciality: FieldRef<"Formateur", 'String'>
    readonly userId: FieldRef<"Formateur", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Formateur findUnique
   */
  export type FormateurFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
    /**
     * Filter, which Formateur to fetch.
     */
    where: FormateurWhereUniqueInput
  }

  /**
   * Formateur findUniqueOrThrow
   */
  export type FormateurFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
    /**
     * Filter, which Formateur to fetch.
     */
    where: FormateurWhereUniqueInput
  }

  /**
   * Formateur findFirst
   */
  export type FormateurFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
    /**
     * Filter, which Formateur to fetch.
     */
    where?: FormateurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Formateurs to fetch.
     */
    orderBy?: FormateurOrderByWithRelationInput | FormateurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Formateurs.
     */
    cursor?: FormateurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Formateurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Formateurs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Formateurs.
     */
    distinct?: FormateurScalarFieldEnum | FormateurScalarFieldEnum[]
  }

  /**
   * Formateur findFirstOrThrow
   */
  export type FormateurFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
    /**
     * Filter, which Formateur to fetch.
     */
    where?: FormateurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Formateurs to fetch.
     */
    orderBy?: FormateurOrderByWithRelationInput | FormateurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Formateurs.
     */
    cursor?: FormateurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Formateurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Formateurs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Formateurs.
     */
    distinct?: FormateurScalarFieldEnum | FormateurScalarFieldEnum[]
  }

  /**
   * Formateur findMany
   */
  export type FormateurFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
    /**
     * Filter, which Formateurs to fetch.
     */
    where?: FormateurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Formateurs to fetch.
     */
    orderBy?: FormateurOrderByWithRelationInput | FormateurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Formateurs.
     */
    cursor?: FormateurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Formateurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Formateurs.
     */
    skip?: number
    distinct?: FormateurScalarFieldEnum | FormateurScalarFieldEnum[]
  }

  /**
   * Formateur create
   */
  export type FormateurCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
    /**
     * The data needed to create a Formateur.
     */
    data: XOR<FormateurCreateInput, FormateurUncheckedCreateInput>
  }

  /**
   * Formateur createMany
   */
  export type FormateurCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Formateurs.
     */
    data: FormateurCreateManyInput | FormateurCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Formateur createManyAndReturn
   */
  export type FormateurCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * The data used to create many Formateurs.
     */
    data: FormateurCreateManyInput | FormateurCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Formateur update
   */
  export type FormateurUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
    /**
     * The data needed to update a Formateur.
     */
    data: XOR<FormateurUpdateInput, FormateurUncheckedUpdateInput>
    /**
     * Choose, which Formateur to update.
     */
    where: FormateurWhereUniqueInput
  }

  /**
   * Formateur updateMany
   */
  export type FormateurUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Formateurs.
     */
    data: XOR<FormateurUpdateManyMutationInput, FormateurUncheckedUpdateManyInput>
    /**
     * Filter which Formateurs to update
     */
    where?: FormateurWhereInput
    /**
     * Limit how many Formateurs to update.
     */
    limit?: number
  }

  /**
   * Formateur updateManyAndReturn
   */
  export type FormateurUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * The data used to update Formateurs.
     */
    data: XOR<FormateurUpdateManyMutationInput, FormateurUncheckedUpdateManyInput>
    /**
     * Filter which Formateurs to update
     */
    where?: FormateurWhereInput
    /**
     * Limit how many Formateurs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Formateur upsert
   */
  export type FormateurUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
    /**
     * The filter to search for the Formateur to update in case it exists.
     */
    where: FormateurWhereUniqueInput
    /**
     * In case the Formateur found by the `where` argument doesn't exist, create a new Formateur with this data.
     */
    create: XOR<FormateurCreateInput, FormateurUncheckedCreateInput>
    /**
     * In case the Formateur was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FormateurUpdateInput, FormateurUncheckedUpdateInput>
  }

  /**
   * Formateur delete
   */
  export type FormateurDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
    /**
     * Filter which Formateur to delete.
     */
    where: FormateurWhereUniqueInput
  }

  /**
   * Formateur deleteMany
   */
  export type FormateurDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Formateurs to delete
     */
    where?: FormateurWhereInput
    /**
     * Limit how many Formateurs to delete.
     */
    limit?: number
  }

  /**
   * Formateur without action
   */
  export type FormateurDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formateur
     */
    select?: FormateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formateur
     */
    omit?: FormateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormateurInclude<ExtArgs> | null
  }


  /**
   * Model Etudiant
   */

  export type AggregateEtudiant = {
    _count: EtudiantCountAggregateOutputType | null
    _avg: EtudiantAvgAggregateOutputType | null
    _sum: EtudiantSumAggregateOutputType | null
    _min: EtudiantMinAggregateOutputType | null
    _max: EtudiantMaxAggregateOutputType | null
  }

  export type EtudiantAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type EtudiantSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type EtudiantMinAggregateOutputType = {
    id: number | null
    NameEtablissement: string | null
    userId: number | null
  }

  export type EtudiantMaxAggregateOutputType = {
    id: number | null
    NameEtablissement: string | null
    userId: number | null
  }

  export type EtudiantCountAggregateOutputType = {
    id: number
    NameEtablissement: number
    userId: number
    _all: number
  }


  export type EtudiantAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type EtudiantSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type EtudiantMinAggregateInputType = {
    id?: true
    NameEtablissement?: true
    userId?: true
  }

  export type EtudiantMaxAggregateInputType = {
    id?: true
    NameEtablissement?: true
    userId?: true
  }

  export type EtudiantCountAggregateInputType = {
    id?: true
    NameEtablissement?: true
    userId?: true
    _all?: true
  }

  export type EtudiantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Etudiant to aggregate.
     */
    where?: EtudiantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Etudiants to fetch.
     */
    orderBy?: EtudiantOrderByWithRelationInput | EtudiantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EtudiantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Etudiants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Etudiants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Etudiants
    **/
    _count?: true | EtudiantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EtudiantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EtudiantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EtudiantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EtudiantMaxAggregateInputType
  }

  export type GetEtudiantAggregateType<T extends EtudiantAggregateArgs> = {
        [P in keyof T & keyof AggregateEtudiant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEtudiant[P]>
      : GetScalarType<T[P], AggregateEtudiant[P]>
  }




  export type EtudiantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EtudiantWhereInput
    orderBy?: EtudiantOrderByWithAggregationInput | EtudiantOrderByWithAggregationInput[]
    by: EtudiantScalarFieldEnum[] | EtudiantScalarFieldEnum
    having?: EtudiantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EtudiantCountAggregateInputType | true
    _avg?: EtudiantAvgAggregateInputType
    _sum?: EtudiantSumAggregateInputType
    _min?: EtudiantMinAggregateInputType
    _max?: EtudiantMaxAggregateInputType
  }

  export type EtudiantGroupByOutputType = {
    id: number
    NameEtablissement: string
    userId: number
    _count: EtudiantCountAggregateOutputType | null
    _avg: EtudiantAvgAggregateOutputType | null
    _sum: EtudiantSumAggregateOutputType | null
    _min: EtudiantMinAggregateOutputType | null
    _max: EtudiantMaxAggregateOutputType | null
  }

  type GetEtudiantGroupByPayload<T extends EtudiantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EtudiantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EtudiantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EtudiantGroupByOutputType[P]>
            : GetScalarType<T[P], EtudiantGroupByOutputType[P]>
        }
      >
    >


  export type EtudiantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    NameEtablissement?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["etudiant"]>

  export type EtudiantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    NameEtablissement?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["etudiant"]>

  export type EtudiantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    NameEtablissement?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["etudiant"]>

  export type EtudiantSelectScalar = {
    id?: boolean
    NameEtablissement?: boolean
    userId?: boolean
  }

  export type EtudiantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "NameEtablissement" | "userId", ExtArgs["result"]["etudiant"]>
  export type EtudiantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EtudiantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EtudiantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EtudiantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Etudiant"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      NameEtablissement: string
      userId: number
    }, ExtArgs["result"]["etudiant"]>
    composites: {}
  }

  type EtudiantGetPayload<S extends boolean | null | undefined | EtudiantDefaultArgs> = $Result.GetResult<Prisma.$EtudiantPayload, S>

  type EtudiantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EtudiantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EtudiantCountAggregateInputType | true
    }

  export interface EtudiantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Etudiant'], meta: { name: 'Etudiant' } }
    /**
     * Find zero or one Etudiant that matches the filter.
     * @param {EtudiantFindUniqueArgs} args - Arguments to find a Etudiant
     * @example
     * // Get one Etudiant
     * const etudiant = await prisma.etudiant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EtudiantFindUniqueArgs>(args: SelectSubset<T, EtudiantFindUniqueArgs<ExtArgs>>): Prisma__EtudiantClient<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Etudiant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EtudiantFindUniqueOrThrowArgs} args - Arguments to find a Etudiant
     * @example
     * // Get one Etudiant
     * const etudiant = await prisma.etudiant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EtudiantFindUniqueOrThrowArgs>(args: SelectSubset<T, EtudiantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EtudiantClient<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Etudiant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtudiantFindFirstArgs} args - Arguments to find a Etudiant
     * @example
     * // Get one Etudiant
     * const etudiant = await prisma.etudiant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EtudiantFindFirstArgs>(args?: SelectSubset<T, EtudiantFindFirstArgs<ExtArgs>>): Prisma__EtudiantClient<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Etudiant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtudiantFindFirstOrThrowArgs} args - Arguments to find a Etudiant
     * @example
     * // Get one Etudiant
     * const etudiant = await prisma.etudiant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EtudiantFindFirstOrThrowArgs>(args?: SelectSubset<T, EtudiantFindFirstOrThrowArgs<ExtArgs>>): Prisma__EtudiantClient<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Etudiants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtudiantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Etudiants
     * const etudiants = await prisma.etudiant.findMany()
     * 
     * // Get first 10 Etudiants
     * const etudiants = await prisma.etudiant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const etudiantWithIdOnly = await prisma.etudiant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EtudiantFindManyArgs>(args?: SelectSubset<T, EtudiantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Etudiant.
     * @param {EtudiantCreateArgs} args - Arguments to create a Etudiant.
     * @example
     * // Create one Etudiant
     * const Etudiant = await prisma.etudiant.create({
     *   data: {
     *     // ... data to create a Etudiant
     *   }
     * })
     * 
     */
    create<T extends EtudiantCreateArgs>(args: SelectSubset<T, EtudiantCreateArgs<ExtArgs>>): Prisma__EtudiantClient<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Etudiants.
     * @param {EtudiantCreateManyArgs} args - Arguments to create many Etudiants.
     * @example
     * // Create many Etudiants
     * const etudiant = await prisma.etudiant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EtudiantCreateManyArgs>(args?: SelectSubset<T, EtudiantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Etudiants and returns the data saved in the database.
     * @param {EtudiantCreateManyAndReturnArgs} args - Arguments to create many Etudiants.
     * @example
     * // Create many Etudiants
     * const etudiant = await prisma.etudiant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Etudiants and only return the `id`
     * const etudiantWithIdOnly = await prisma.etudiant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EtudiantCreateManyAndReturnArgs>(args?: SelectSubset<T, EtudiantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Etudiant.
     * @param {EtudiantDeleteArgs} args - Arguments to delete one Etudiant.
     * @example
     * // Delete one Etudiant
     * const Etudiant = await prisma.etudiant.delete({
     *   where: {
     *     // ... filter to delete one Etudiant
     *   }
     * })
     * 
     */
    delete<T extends EtudiantDeleteArgs>(args: SelectSubset<T, EtudiantDeleteArgs<ExtArgs>>): Prisma__EtudiantClient<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Etudiant.
     * @param {EtudiantUpdateArgs} args - Arguments to update one Etudiant.
     * @example
     * // Update one Etudiant
     * const etudiant = await prisma.etudiant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EtudiantUpdateArgs>(args: SelectSubset<T, EtudiantUpdateArgs<ExtArgs>>): Prisma__EtudiantClient<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Etudiants.
     * @param {EtudiantDeleteManyArgs} args - Arguments to filter Etudiants to delete.
     * @example
     * // Delete a few Etudiants
     * const { count } = await prisma.etudiant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EtudiantDeleteManyArgs>(args?: SelectSubset<T, EtudiantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Etudiants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtudiantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Etudiants
     * const etudiant = await prisma.etudiant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EtudiantUpdateManyArgs>(args: SelectSubset<T, EtudiantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Etudiants and returns the data updated in the database.
     * @param {EtudiantUpdateManyAndReturnArgs} args - Arguments to update many Etudiants.
     * @example
     * // Update many Etudiants
     * const etudiant = await prisma.etudiant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Etudiants and only return the `id`
     * const etudiantWithIdOnly = await prisma.etudiant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EtudiantUpdateManyAndReturnArgs>(args: SelectSubset<T, EtudiantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Etudiant.
     * @param {EtudiantUpsertArgs} args - Arguments to update or create a Etudiant.
     * @example
     * // Update or create a Etudiant
     * const etudiant = await prisma.etudiant.upsert({
     *   create: {
     *     // ... data to create a Etudiant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Etudiant we want to update
     *   }
     * })
     */
    upsert<T extends EtudiantUpsertArgs>(args: SelectSubset<T, EtudiantUpsertArgs<ExtArgs>>): Prisma__EtudiantClient<$Result.GetResult<Prisma.$EtudiantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Etudiants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtudiantCountArgs} args - Arguments to filter Etudiants to count.
     * @example
     * // Count the number of Etudiants
     * const count = await prisma.etudiant.count({
     *   where: {
     *     // ... the filter for the Etudiants we want to count
     *   }
     * })
    **/
    count<T extends EtudiantCountArgs>(
      args?: Subset<T, EtudiantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EtudiantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Etudiant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtudiantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EtudiantAggregateArgs>(args: Subset<T, EtudiantAggregateArgs>): Prisma.PrismaPromise<GetEtudiantAggregateType<T>>

    /**
     * Group by Etudiant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtudiantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EtudiantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EtudiantGroupByArgs['orderBy'] }
        : { orderBy?: EtudiantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EtudiantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEtudiantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Etudiant model
   */
  readonly fields: EtudiantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Etudiant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EtudiantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Etudiant model
   */
  interface EtudiantFieldRefs {
    readonly id: FieldRef<"Etudiant", 'Int'>
    readonly NameEtablissement: FieldRef<"Etudiant", 'String'>
    readonly userId: FieldRef<"Etudiant", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Etudiant findUnique
   */
  export type EtudiantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
    /**
     * Filter, which Etudiant to fetch.
     */
    where: EtudiantWhereUniqueInput
  }

  /**
   * Etudiant findUniqueOrThrow
   */
  export type EtudiantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
    /**
     * Filter, which Etudiant to fetch.
     */
    where: EtudiantWhereUniqueInput
  }

  /**
   * Etudiant findFirst
   */
  export type EtudiantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
    /**
     * Filter, which Etudiant to fetch.
     */
    where?: EtudiantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Etudiants to fetch.
     */
    orderBy?: EtudiantOrderByWithRelationInput | EtudiantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Etudiants.
     */
    cursor?: EtudiantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Etudiants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Etudiants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Etudiants.
     */
    distinct?: EtudiantScalarFieldEnum | EtudiantScalarFieldEnum[]
  }

  /**
   * Etudiant findFirstOrThrow
   */
  export type EtudiantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
    /**
     * Filter, which Etudiant to fetch.
     */
    where?: EtudiantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Etudiants to fetch.
     */
    orderBy?: EtudiantOrderByWithRelationInput | EtudiantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Etudiants.
     */
    cursor?: EtudiantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Etudiants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Etudiants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Etudiants.
     */
    distinct?: EtudiantScalarFieldEnum | EtudiantScalarFieldEnum[]
  }

  /**
   * Etudiant findMany
   */
  export type EtudiantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
    /**
     * Filter, which Etudiants to fetch.
     */
    where?: EtudiantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Etudiants to fetch.
     */
    orderBy?: EtudiantOrderByWithRelationInput | EtudiantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Etudiants.
     */
    cursor?: EtudiantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Etudiants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Etudiants.
     */
    skip?: number
    distinct?: EtudiantScalarFieldEnum | EtudiantScalarFieldEnum[]
  }

  /**
   * Etudiant create
   */
  export type EtudiantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
    /**
     * The data needed to create a Etudiant.
     */
    data: XOR<EtudiantCreateInput, EtudiantUncheckedCreateInput>
  }

  /**
   * Etudiant createMany
   */
  export type EtudiantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Etudiants.
     */
    data: EtudiantCreateManyInput | EtudiantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Etudiant createManyAndReturn
   */
  export type EtudiantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * The data used to create many Etudiants.
     */
    data: EtudiantCreateManyInput | EtudiantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Etudiant update
   */
  export type EtudiantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
    /**
     * The data needed to update a Etudiant.
     */
    data: XOR<EtudiantUpdateInput, EtudiantUncheckedUpdateInput>
    /**
     * Choose, which Etudiant to update.
     */
    where: EtudiantWhereUniqueInput
  }

  /**
   * Etudiant updateMany
   */
  export type EtudiantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Etudiants.
     */
    data: XOR<EtudiantUpdateManyMutationInput, EtudiantUncheckedUpdateManyInput>
    /**
     * Filter which Etudiants to update
     */
    where?: EtudiantWhereInput
    /**
     * Limit how many Etudiants to update.
     */
    limit?: number
  }

  /**
   * Etudiant updateManyAndReturn
   */
  export type EtudiantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * The data used to update Etudiants.
     */
    data: XOR<EtudiantUpdateManyMutationInput, EtudiantUncheckedUpdateManyInput>
    /**
     * Filter which Etudiants to update
     */
    where?: EtudiantWhereInput
    /**
     * Limit how many Etudiants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Etudiant upsert
   */
  export type EtudiantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
    /**
     * The filter to search for the Etudiant to update in case it exists.
     */
    where: EtudiantWhereUniqueInput
    /**
     * In case the Etudiant found by the `where` argument doesn't exist, create a new Etudiant with this data.
     */
    create: XOR<EtudiantCreateInput, EtudiantUncheckedCreateInput>
    /**
     * In case the Etudiant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EtudiantUpdateInput, EtudiantUncheckedUpdateInput>
  }

  /**
   * Etudiant delete
   */
  export type EtudiantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
    /**
     * Filter which Etudiant to delete.
     */
    where: EtudiantWhereUniqueInput
  }

  /**
   * Etudiant deleteMany
   */
  export type EtudiantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Etudiants to delete
     */
    where?: EtudiantWhereInput
    /**
     * Limit how many Etudiants to delete.
     */
    limit?: number
  }

  /**
   * Etudiant without action
   */
  export type EtudiantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etudiant
     */
    select?: EtudiantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etudiant
     */
    omit?: EtudiantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtudiantInclude<ExtArgs> | null
  }


  /**
   * Model CreateurDeFormation
   */

  export type AggregateCreateurDeFormation = {
    _count: CreateurDeFormationCountAggregateOutputType | null
    _avg: CreateurDeFormationAvgAggregateOutputType | null
    _sum: CreateurDeFormationSumAggregateOutputType | null
    _min: CreateurDeFormationMinAggregateOutputType | null
    _max: CreateurDeFormationMaxAggregateOutputType | null
  }

  export type CreateurDeFormationAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type CreateurDeFormationSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type CreateurDeFormationMinAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type CreateurDeFormationMaxAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type CreateurDeFormationCountAggregateOutputType = {
    id: number
    userId: number
    _all: number
  }


  export type CreateurDeFormationAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type CreateurDeFormationSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type CreateurDeFormationMinAggregateInputType = {
    id?: true
    userId?: true
  }

  export type CreateurDeFormationMaxAggregateInputType = {
    id?: true
    userId?: true
  }

  export type CreateurDeFormationCountAggregateInputType = {
    id?: true
    userId?: true
    _all?: true
  }

  export type CreateurDeFormationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CreateurDeFormation to aggregate.
     */
    where?: CreateurDeFormationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreateurDeFormations to fetch.
     */
    orderBy?: CreateurDeFormationOrderByWithRelationInput | CreateurDeFormationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CreateurDeFormationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreateurDeFormations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreateurDeFormations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CreateurDeFormations
    **/
    _count?: true | CreateurDeFormationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CreateurDeFormationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CreateurDeFormationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CreateurDeFormationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CreateurDeFormationMaxAggregateInputType
  }

  export type GetCreateurDeFormationAggregateType<T extends CreateurDeFormationAggregateArgs> = {
        [P in keyof T & keyof AggregateCreateurDeFormation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCreateurDeFormation[P]>
      : GetScalarType<T[P], AggregateCreateurDeFormation[P]>
  }




  export type CreateurDeFormationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CreateurDeFormationWhereInput
    orderBy?: CreateurDeFormationOrderByWithAggregationInput | CreateurDeFormationOrderByWithAggregationInput[]
    by: CreateurDeFormationScalarFieldEnum[] | CreateurDeFormationScalarFieldEnum
    having?: CreateurDeFormationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CreateurDeFormationCountAggregateInputType | true
    _avg?: CreateurDeFormationAvgAggregateInputType
    _sum?: CreateurDeFormationSumAggregateInputType
    _min?: CreateurDeFormationMinAggregateInputType
    _max?: CreateurDeFormationMaxAggregateInputType
  }

  export type CreateurDeFormationGroupByOutputType = {
    id: number
    userId: number
    _count: CreateurDeFormationCountAggregateOutputType | null
    _avg: CreateurDeFormationAvgAggregateOutputType | null
    _sum: CreateurDeFormationSumAggregateOutputType | null
    _min: CreateurDeFormationMinAggregateOutputType | null
    _max: CreateurDeFormationMaxAggregateOutputType | null
  }

  type GetCreateurDeFormationGroupByPayload<T extends CreateurDeFormationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CreateurDeFormationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CreateurDeFormationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CreateurDeFormationGroupByOutputType[P]>
            : GetScalarType<T[P], CreateurDeFormationGroupByOutputType[P]>
        }
      >
    >


  export type CreateurDeFormationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["createurDeFormation"]>

  export type CreateurDeFormationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["createurDeFormation"]>

  export type CreateurDeFormationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["createurDeFormation"]>

  export type CreateurDeFormationSelectScalar = {
    id?: boolean
    userId?: boolean
  }

  export type CreateurDeFormationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId", ExtArgs["result"]["createurDeFormation"]>
  export type CreateurDeFormationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CreateurDeFormationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CreateurDeFormationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CreateurDeFormationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CreateurDeFormation"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
    }, ExtArgs["result"]["createurDeFormation"]>
    composites: {}
  }

  type CreateurDeFormationGetPayload<S extends boolean | null | undefined | CreateurDeFormationDefaultArgs> = $Result.GetResult<Prisma.$CreateurDeFormationPayload, S>

  type CreateurDeFormationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CreateurDeFormationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CreateurDeFormationCountAggregateInputType | true
    }

  export interface CreateurDeFormationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CreateurDeFormation'], meta: { name: 'CreateurDeFormation' } }
    /**
     * Find zero or one CreateurDeFormation that matches the filter.
     * @param {CreateurDeFormationFindUniqueArgs} args - Arguments to find a CreateurDeFormation
     * @example
     * // Get one CreateurDeFormation
     * const createurDeFormation = await prisma.createurDeFormation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CreateurDeFormationFindUniqueArgs>(args: SelectSubset<T, CreateurDeFormationFindUniqueArgs<ExtArgs>>): Prisma__CreateurDeFormationClient<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CreateurDeFormation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CreateurDeFormationFindUniqueOrThrowArgs} args - Arguments to find a CreateurDeFormation
     * @example
     * // Get one CreateurDeFormation
     * const createurDeFormation = await prisma.createurDeFormation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CreateurDeFormationFindUniqueOrThrowArgs>(args: SelectSubset<T, CreateurDeFormationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CreateurDeFormationClient<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CreateurDeFormation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreateurDeFormationFindFirstArgs} args - Arguments to find a CreateurDeFormation
     * @example
     * // Get one CreateurDeFormation
     * const createurDeFormation = await prisma.createurDeFormation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CreateurDeFormationFindFirstArgs>(args?: SelectSubset<T, CreateurDeFormationFindFirstArgs<ExtArgs>>): Prisma__CreateurDeFormationClient<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CreateurDeFormation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreateurDeFormationFindFirstOrThrowArgs} args - Arguments to find a CreateurDeFormation
     * @example
     * // Get one CreateurDeFormation
     * const createurDeFormation = await prisma.createurDeFormation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CreateurDeFormationFindFirstOrThrowArgs>(args?: SelectSubset<T, CreateurDeFormationFindFirstOrThrowArgs<ExtArgs>>): Prisma__CreateurDeFormationClient<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CreateurDeFormations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreateurDeFormationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CreateurDeFormations
     * const createurDeFormations = await prisma.createurDeFormation.findMany()
     * 
     * // Get first 10 CreateurDeFormations
     * const createurDeFormations = await prisma.createurDeFormation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const createurDeFormationWithIdOnly = await prisma.createurDeFormation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CreateurDeFormationFindManyArgs>(args?: SelectSubset<T, CreateurDeFormationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CreateurDeFormation.
     * @param {CreateurDeFormationCreateArgs} args - Arguments to create a CreateurDeFormation.
     * @example
     * // Create one CreateurDeFormation
     * const CreateurDeFormation = await prisma.createurDeFormation.create({
     *   data: {
     *     // ... data to create a CreateurDeFormation
     *   }
     * })
     * 
     */
    create<T extends CreateurDeFormationCreateArgs>(args: SelectSubset<T, CreateurDeFormationCreateArgs<ExtArgs>>): Prisma__CreateurDeFormationClient<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CreateurDeFormations.
     * @param {CreateurDeFormationCreateManyArgs} args - Arguments to create many CreateurDeFormations.
     * @example
     * // Create many CreateurDeFormations
     * const createurDeFormation = await prisma.createurDeFormation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CreateurDeFormationCreateManyArgs>(args?: SelectSubset<T, CreateurDeFormationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CreateurDeFormations and returns the data saved in the database.
     * @param {CreateurDeFormationCreateManyAndReturnArgs} args - Arguments to create many CreateurDeFormations.
     * @example
     * // Create many CreateurDeFormations
     * const createurDeFormation = await prisma.createurDeFormation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CreateurDeFormations and only return the `id`
     * const createurDeFormationWithIdOnly = await prisma.createurDeFormation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CreateurDeFormationCreateManyAndReturnArgs>(args?: SelectSubset<T, CreateurDeFormationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CreateurDeFormation.
     * @param {CreateurDeFormationDeleteArgs} args - Arguments to delete one CreateurDeFormation.
     * @example
     * // Delete one CreateurDeFormation
     * const CreateurDeFormation = await prisma.createurDeFormation.delete({
     *   where: {
     *     // ... filter to delete one CreateurDeFormation
     *   }
     * })
     * 
     */
    delete<T extends CreateurDeFormationDeleteArgs>(args: SelectSubset<T, CreateurDeFormationDeleteArgs<ExtArgs>>): Prisma__CreateurDeFormationClient<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CreateurDeFormation.
     * @param {CreateurDeFormationUpdateArgs} args - Arguments to update one CreateurDeFormation.
     * @example
     * // Update one CreateurDeFormation
     * const createurDeFormation = await prisma.createurDeFormation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CreateurDeFormationUpdateArgs>(args: SelectSubset<T, CreateurDeFormationUpdateArgs<ExtArgs>>): Prisma__CreateurDeFormationClient<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CreateurDeFormations.
     * @param {CreateurDeFormationDeleteManyArgs} args - Arguments to filter CreateurDeFormations to delete.
     * @example
     * // Delete a few CreateurDeFormations
     * const { count } = await prisma.createurDeFormation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CreateurDeFormationDeleteManyArgs>(args?: SelectSubset<T, CreateurDeFormationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CreateurDeFormations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreateurDeFormationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CreateurDeFormations
     * const createurDeFormation = await prisma.createurDeFormation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CreateurDeFormationUpdateManyArgs>(args: SelectSubset<T, CreateurDeFormationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CreateurDeFormations and returns the data updated in the database.
     * @param {CreateurDeFormationUpdateManyAndReturnArgs} args - Arguments to update many CreateurDeFormations.
     * @example
     * // Update many CreateurDeFormations
     * const createurDeFormation = await prisma.createurDeFormation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CreateurDeFormations and only return the `id`
     * const createurDeFormationWithIdOnly = await prisma.createurDeFormation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CreateurDeFormationUpdateManyAndReturnArgs>(args: SelectSubset<T, CreateurDeFormationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CreateurDeFormation.
     * @param {CreateurDeFormationUpsertArgs} args - Arguments to update or create a CreateurDeFormation.
     * @example
     * // Update or create a CreateurDeFormation
     * const createurDeFormation = await prisma.createurDeFormation.upsert({
     *   create: {
     *     // ... data to create a CreateurDeFormation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CreateurDeFormation we want to update
     *   }
     * })
     */
    upsert<T extends CreateurDeFormationUpsertArgs>(args: SelectSubset<T, CreateurDeFormationUpsertArgs<ExtArgs>>): Prisma__CreateurDeFormationClient<$Result.GetResult<Prisma.$CreateurDeFormationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CreateurDeFormations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreateurDeFormationCountArgs} args - Arguments to filter CreateurDeFormations to count.
     * @example
     * // Count the number of CreateurDeFormations
     * const count = await prisma.createurDeFormation.count({
     *   where: {
     *     // ... the filter for the CreateurDeFormations we want to count
     *   }
     * })
    **/
    count<T extends CreateurDeFormationCountArgs>(
      args?: Subset<T, CreateurDeFormationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CreateurDeFormationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CreateurDeFormation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreateurDeFormationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CreateurDeFormationAggregateArgs>(args: Subset<T, CreateurDeFormationAggregateArgs>): Prisma.PrismaPromise<GetCreateurDeFormationAggregateType<T>>

    /**
     * Group by CreateurDeFormation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreateurDeFormationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CreateurDeFormationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CreateurDeFormationGroupByArgs['orderBy'] }
        : { orderBy?: CreateurDeFormationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CreateurDeFormationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCreateurDeFormationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CreateurDeFormation model
   */
  readonly fields: CreateurDeFormationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CreateurDeFormation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CreateurDeFormationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CreateurDeFormation model
   */
  interface CreateurDeFormationFieldRefs {
    readonly id: FieldRef<"CreateurDeFormation", 'Int'>
    readonly userId: FieldRef<"CreateurDeFormation", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * CreateurDeFormation findUnique
   */
  export type CreateurDeFormationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
    /**
     * Filter, which CreateurDeFormation to fetch.
     */
    where: CreateurDeFormationWhereUniqueInput
  }

  /**
   * CreateurDeFormation findUniqueOrThrow
   */
  export type CreateurDeFormationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
    /**
     * Filter, which CreateurDeFormation to fetch.
     */
    where: CreateurDeFormationWhereUniqueInput
  }

  /**
   * CreateurDeFormation findFirst
   */
  export type CreateurDeFormationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
    /**
     * Filter, which CreateurDeFormation to fetch.
     */
    where?: CreateurDeFormationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreateurDeFormations to fetch.
     */
    orderBy?: CreateurDeFormationOrderByWithRelationInput | CreateurDeFormationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CreateurDeFormations.
     */
    cursor?: CreateurDeFormationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreateurDeFormations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreateurDeFormations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CreateurDeFormations.
     */
    distinct?: CreateurDeFormationScalarFieldEnum | CreateurDeFormationScalarFieldEnum[]
  }

  /**
   * CreateurDeFormation findFirstOrThrow
   */
  export type CreateurDeFormationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
    /**
     * Filter, which CreateurDeFormation to fetch.
     */
    where?: CreateurDeFormationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreateurDeFormations to fetch.
     */
    orderBy?: CreateurDeFormationOrderByWithRelationInput | CreateurDeFormationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CreateurDeFormations.
     */
    cursor?: CreateurDeFormationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreateurDeFormations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreateurDeFormations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CreateurDeFormations.
     */
    distinct?: CreateurDeFormationScalarFieldEnum | CreateurDeFormationScalarFieldEnum[]
  }

  /**
   * CreateurDeFormation findMany
   */
  export type CreateurDeFormationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
    /**
     * Filter, which CreateurDeFormations to fetch.
     */
    where?: CreateurDeFormationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreateurDeFormations to fetch.
     */
    orderBy?: CreateurDeFormationOrderByWithRelationInput | CreateurDeFormationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CreateurDeFormations.
     */
    cursor?: CreateurDeFormationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreateurDeFormations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreateurDeFormations.
     */
    skip?: number
    distinct?: CreateurDeFormationScalarFieldEnum | CreateurDeFormationScalarFieldEnum[]
  }

  /**
   * CreateurDeFormation create
   */
  export type CreateurDeFormationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
    /**
     * The data needed to create a CreateurDeFormation.
     */
    data: XOR<CreateurDeFormationCreateInput, CreateurDeFormationUncheckedCreateInput>
  }

  /**
   * CreateurDeFormation createMany
   */
  export type CreateurDeFormationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CreateurDeFormations.
     */
    data: CreateurDeFormationCreateManyInput | CreateurDeFormationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CreateurDeFormation createManyAndReturn
   */
  export type CreateurDeFormationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * The data used to create many CreateurDeFormations.
     */
    data: CreateurDeFormationCreateManyInput | CreateurDeFormationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CreateurDeFormation update
   */
  export type CreateurDeFormationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
    /**
     * The data needed to update a CreateurDeFormation.
     */
    data: XOR<CreateurDeFormationUpdateInput, CreateurDeFormationUncheckedUpdateInput>
    /**
     * Choose, which CreateurDeFormation to update.
     */
    where: CreateurDeFormationWhereUniqueInput
  }

  /**
   * CreateurDeFormation updateMany
   */
  export type CreateurDeFormationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CreateurDeFormations.
     */
    data: XOR<CreateurDeFormationUpdateManyMutationInput, CreateurDeFormationUncheckedUpdateManyInput>
    /**
     * Filter which CreateurDeFormations to update
     */
    where?: CreateurDeFormationWhereInput
    /**
     * Limit how many CreateurDeFormations to update.
     */
    limit?: number
  }

  /**
   * CreateurDeFormation updateManyAndReturn
   */
  export type CreateurDeFormationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * The data used to update CreateurDeFormations.
     */
    data: XOR<CreateurDeFormationUpdateManyMutationInput, CreateurDeFormationUncheckedUpdateManyInput>
    /**
     * Filter which CreateurDeFormations to update
     */
    where?: CreateurDeFormationWhereInput
    /**
     * Limit how many CreateurDeFormations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CreateurDeFormation upsert
   */
  export type CreateurDeFormationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
    /**
     * The filter to search for the CreateurDeFormation to update in case it exists.
     */
    where: CreateurDeFormationWhereUniqueInput
    /**
     * In case the CreateurDeFormation found by the `where` argument doesn't exist, create a new CreateurDeFormation with this data.
     */
    create: XOR<CreateurDeFormationCreateInput, CreateurDeFormationUncheckedCreateInput>
    /**
     * In case the CreateurDeFormation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CreateurDeFormationUpdateInput, CreateurDeFormationUncheckedUpdateInput>
  }

  /**
   * CreateurDeFormation delete
   */
  export type CreateurDeFormationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
    /**
     * Filter which CreateurDeFormation to delete.
     */
    where: CreateurDeFormationWhereUniqueInput
  }

  /**
   * CreateurDeFormation deleteMany
   */
  export type CreateurDeFormationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CreateurDeFormations to delete
     */
    where?: CreateurDeFormationWhereInput
    /**
     * Limit how many CreateurDeFormations to delete.
     */
    limit?: number
  }

  /**
   * CreateurDeFormation without action
   */
  export type CreateurDeFormationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreateurDeFormation
     */
    select?: CreateurDeFormationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreateurDeFormation
     */
    omit?: CreateurDeFormationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreateurDeFormationInclude<ExtArgs> | null
  }


  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  export type AdminAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type AdminSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type AdminMinAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type AdminMaxAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type AdminCountAggregateOutputType = {
    id: number
    userId: number
    _all: number
  }


  export type AdminAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AdminSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AdminMinAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AdminMaxAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AdminCountAggregateInputType = {
    id?: true
    userId?: true
    _all?: true
  }

  export type AdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admins
    **/
    _count?: true | AdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMaxAggregateInputType
  }

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>
  }




  export type AdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithAggregationInput | AdminOrderByWithAggregationInput[]
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum
    having?: AdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminCountAggregateInputType | true
    _avg?: AdminAvgAggregateInputType
    _sum?: AdminSumAggregateInputType
    _min?: AdminMinAggregateInputType
    _max?: AdminMaxAggregateInputType
  }

  export type AdminGroupByOutputType = {
    id: number
    userId: number
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>
        }
      >
    >


  export type AdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectScalar = {
    id?: boolean
    userId?: boolean
  }

  export type AdminOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId", ExtArgs["result"]["admin"]>
  export type AdminInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AdminIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AdminIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Admin"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
    }, ExtArgs["result"]["admin"]>
    composites: {}
  }

  type AdminGetPayload<S extends boolean | null | undefined | AdminDefaultArgs> = $Result.GetResult<Prisma.$AdminPayload, S>

  type AdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminCountAggregateInputType | true
    }

  export interface AdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Admin'], meta: { name: 'Admin' } }
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminWithIdOnly = await prisma.admin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminFindManyArgs>(args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     * 
     */
    create<T extends AdminCreateArgs>(args: SelectSubset<T, AdminCreateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminCreateManyArgs>(args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {AdminCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     * 
     */
    delete<T extends AdminDeleteArgs>(args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUpdateArgs>(args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminDeleteManyArgs>(args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUpdateManyArgs>(args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins and returns the data updated in the database.
     * @param {AdminUpdateManyAndReturnArgs} args - Arguments to update many Admins.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAggregateArgs>(args: Subset<T, AdminAggregateArgs>): Prisma.PrismaPromise<GetAdminAggregateType<T>>

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Admin model
   */
  readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Admin model
   */
  interface AdminFieldRefs {
    readonly id: FieldRef<"Admin", 'Int'>
    readonly userId: FieldRef<"Admin", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin create
   */
  export type AdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>
  }

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin createManyAndReturn
   */
  export type AdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Admin update
   */
  export type AdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
  }

  /**
   * Admin updateManyAndReturn
   */
  export type AdminUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
  }

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to delete.
     */
    limit?: number
  }

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
  }


  /**
   * Model Etablissement
   */

  export type AggregateEtablissement = {
    _count: EtablissementCountAggregateOutputType | null
    _avg: EtablissementAvgAggregateOutputType | null
    _sum: EtablissementSumAggregateOutputType | null
    _min: EtablissementMinAggregateOutputType | null
    _max: EtablissementMaxAggregateOutputType | null
  }

  export type EtablissementAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type EtablissementSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type EtablissementMinAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type EtablissementMaxAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type EtablissementCountAggregateOutputType = {
    id: number
    userId: number
    _all: number
  }


  export type EtablissementAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type EtablissementSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type EtablissementMinAggregateInputType = {
    id?: true
    userId?: true
  }

  export type EtablissementMaxAggregateInputType = {
    id?: true
    userId?: true
  }

  export type EtablissementCountAggregateInputType = {
    id?: true
    userId?: true
    _all?: true
  }

  export type EtablissementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Etablissement to aggregate.
     */
    where?: EtablissementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Etablissements to fetch.
     */
    orderBy?: EtablissementOrderByWithRelationInput | EtablissementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EtablissementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Etablissements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Etablissements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Etablissements
    **/
    _count?: true | EtablissementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EtablissementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EtablissementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EtablissementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EtablissementMaxAggregateInputType
  }

  export type GetEtablissementAggregateType<T extends EtablissementAggregateArgs> = {
        [P in keyof T & keyof AggregateEtablissement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEtablissement[P]>
      : GetScalarType<T[P], AggregateEtablissement[P]>
  }




  export type EtablissementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EtablissementWhereInput
    orderBy?: EtablissementOrderByWithAggregationInput | EtablissementOrderByWithAggregationInput[]
    by: EtablissementScalarFieldEnum[] | EtablissementScalarFieldEnum
    having?: EtablissementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EtablissementCountAggregateInputType | true
    _avg?: EtablissementAvgAggregateInputType
    _sum?: EtablissementSumAggregateInputType
    _min?: EtablissementMinAggregateInputType
    _max?: EtablissementMaxAggregateInputType
  }

  export type EtablissementGroupByOutputType = {
    id: number
    userId: number
    _count: EtablissementCountAggregateOutputType | null
    _avg: EtablissementAvgAggregateOutputType | null
    _sum: EtablissementSumAggregateOutputType | null
    _min: EtablissementMinAggregateOutputType | null
    _max: EtablissementMaxAggregateOutputType | null
  }

  type GetEtablissementGroupByPayload<T extends EtablissementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EtablissementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EtablissementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EtablissementGroupByOutputType[P]>
            : GetScalarType<T[P], EtablissementGroupByOutputType[P]>
        }
      >
    >


  export type EtablissementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["etablissement"]>

  export type EtablissementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["etablissement"]>

  export type EtablissementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["etablissement"]>

  export type EtablissementSelectScalar = {
    id?: boolean
    userId?: boolean
  }

  export type EtablissementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId", ExtArgs["result"]["etablissement"]>
  export type EtablissementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EtablissementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EtablissementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EtablissementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Etablissement"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
    }, ExtArgs["result"]["etablissement"]>
    composites: {}
  }

  type EtablissementGetPayload<S extends boolean | null | undefined | EtablissementDefaultArgs> = $Result.GetResult<Prisma.$EtablissementPayload, S>

  type EtablissementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EtablissementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EtablissementCountAggregateInputType | true
    }

  export interface EtablissementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Etablissement'], meta: { name: 'Etablissement' } }
    /**
     * Find zero or one Etablissement that matches the filter.
     * @param {EtablissementFindUniqueArgs} args - Arguments to find a Etablissement
     * @example
     * // Get one Etablissement
     * const etablissement = await prisma.etablissement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EtablissementFindUniqueArgs>(args: SelectSubset<T, EtablissementFindUniqueArgs<ExtArgs>>): Prisma__EtablissementClient<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Etablissement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EtablissementFindUniqueOrThrowArgs} args - Arguments to find a Etablissement
     * @example
     * // Get one Etablissement
     * const etablissement = await prisma.etablissement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EtablissementFindUniqueOrThrowArgs>(args: SelectSubset<T, EtablissementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EtablissementClient<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Etablissement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtablissementFindFirstArgs} args - Arguments to find a Etablissement
     * @example
     * // Get one Etablissement
     * const etablissement = await prisma.etablissement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EtablissementFindFirstArgs>(args?: SelectSubset<T, EtablissementFindFirstArgs<ExtArgs>>): Prisma__EtablissementClient<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Etablissement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtablissementFindFirstOrThrowArgs} args - Arguments to find a Etablissement
     * @example
     * // Get one Etablissement
     * const etablissement = await prisma.etablissement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EtablissementFindFirstOrThrowArgs>(args?: SelectSubset<T, EtablissementFindFirstOrThrowArgs<ExtArgs>>): Prisma__EtablissementClient<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Etablissements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtablissementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Etablissements
     * const etablissements = await prisma.etablissement.findMany()
     * 
     * // Get first 10 Etablissements
     * const etablissements = await prisma.etablissement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const etablissementWithIdOnly = await prisma.etablissement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EtablissementFindManyArgs>(args?: SelectSubset<T, EtablissementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Etablissement.
     * @param {EtablissementCreateArgs} args - Arguments to create a Etablissement.
     * @example
     * // Create one Etablissement
     * const Etablissement = await prisma.etablissement.create({
     *   data: {
     *     // ... data to create a Etablissement
     *   }
     * })
     * 
     */
    create<T extends EtablissementCreateArgs>(args: SelectSubset<T, EtablissementCreateArgs<ExtArgs>>): Prisma__EtablissementClient<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Etablissements.
     * @param {EtablissementCreateManyArgs} args - Arguments to create many Etablissements.
     * @example
     * // Create many Etablissements
     * const etablissement = await prisma.etablissement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EtablissementCreateManyArgs>(args?: SelectSubset<T, EtablissementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Etablissements and returns the data saved in the database.
     * @param {EtablissementCreateManyAndReturnArgs} args - Arguments to create many Etablissements.
     * @example
     * // Create many Etablissements
     * const etablissement = await prisma.etablissement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Etablissements and only return the `id`
     * const etablissementWithIdOnly = await prisma.etablissement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EtablissementCreateManyAndReturnArgs>(args?: SelectSubset<T, EtablissementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Etablissement.
     * @param {EtablissementDeleteArgs} args - Arguments to delete one Etablissement.
     * @example
     * // Delete one Etablissement
     * const Etablissement = await prisma.etablissement.delete({
     *   where: {
     *     // ... filter to delete one Etablissement
     *   }
     * })
     * 
     */
    delete<T extends EtablissementDeleteArgs>(args: SelectSubset<T, EtablissementDeleteArgs<ExtArgs>>): Prisma__EtablissementClient<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Etablissement.
     * @param {EtablissementUpdateArgs} args - Arguments to update one Etablissement.
     * @example
     * // Update one Etablissement
     * const etablissement = await prisma.etablissement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EtablissementUpdateArgs>(args: SelectSubset<T, EtablissementUpdateArgs<ExtArgs>>): Prisma__EtablissementClient<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Etablissements.
     * @param {EtablissementDeleteManyArgs} args - Arguments to filter Etablissements to delete.
     * @example
     * // Delete a few Etablissements
     * const { count } = await prisma.etablissement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EtablissementDeleteManyArgs>(args?: SelectSubset<T, EtablissementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Etablissements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtablissementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Etablissements
     * const etablissement = await prisma.etablissement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EtablissementUpdateManyArgs>(args: SelectSubset<T, EtablissementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Etablissements and returns the data updated in the database.
     * @param {EtablissementUpdateManyAndReturnArgs} args - Arguments to update many Etablissements.
     * @example
     * // Update many Etablissements
     * const etablissement = await prisma.etablissement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Etablissements and only return the `id`
     * const etablissementWithIdOnly = await prisma.etablissement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EtablissementUpdateManyAndReturnArgs>(args: SelectSubset<T, EtablissementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Etablissement.
     * @param {EtablissementUpsertArgs} args - Arguments to update or create a Etablissement.
     * @example
     * // Update or create a Etablissement
     * const etablissement = await prisma.etablissement.upsert({
     *   create: {
     *     // ... data to create a Etablissement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Etablissement we want to update
     *   }
     * })
     */
    upsert<T extends EtablissementUpsertArgs>(args: SelectSubset<T, EtablissementUpsertArgs<ExtArgs>>): Prisma__EtablissementClient<$Result.GetResult<Prisma.$EtablissementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Etablissements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtablissementCountArgs} args - Arguments to filter Etablissements to count.
     * @example
     * // Count the number of Etablissements
     * const count = await prisma.etablissement.count({
     *   where: {
     *     // ... the filter for the Etablissements we want to count
     *   }
     * })
    **/
    count<T extends EtablissementCountArgs>(
      args?: Subset<T, EtablissementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EtablissementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Etablissement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtablissementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EtablissementAggregateArgs>(args: Subset<T, EtablissementAggregateArgs>): Prisma.PrismaPromise<GetEtablissementAggregateType<T>>

    /**
     * Group by Etablissement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EtablissementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EtablissementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EtablissementGroupByArgs['orderBy'] }
        : { orderBy?: EtablissementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EtablissementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEtablissementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Etablissement model
   */
  readonly fields: EtablissementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Etablissement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EtablissementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Etablissement model
   */
  interface EtablissementFieldRefs {
    readonly id: FieldRef<"Etablissement", 'Int'>
    readonly userId: FieldRef<"Etablissement", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Etablissement findUnique
   */
  export type EtablissementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
    /**
     * Filter, which Etablissement to fetch.
     */
    where: EtablissementWhereUniqueInput
  }

  /**
   * Etablissement findUniqueOrThrow
   */
  export type EtablissementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
    /**
     * Filter, which Etablissement to fetch.
     */
    where: EtablissementWhereUniqueInput
  }

  /**
   * Etablissement findFirst
   */
  export type EtablissementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
    /**
     * Filter, which Etablissement to fetch.
     */
    where?: EtablissementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Etablissements to fetch.
     */
    orderBy?: EtablissementOrderByWithRelationInput | EtablissementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Etablissements.
     */
    cursor?: EtablissementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Etablissements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Etablissements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Etablissements.
     */
    distinct?: EtablissementScalarFieldEnum | EtablissementScalarFieldEnum[]
  }

  /**
   * Etablissement findFirstOrThrow
   */
  export type EtablissementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
    /**
     * Filter, which Etablissement to fetch.
     */
    where?: EtablissementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Etablissements to fetch.
     */
    orderBy?: EtablissementOrderByWithRelationInput | EtablissementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Etablissements.
     */
    cursor?: EtablissementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Etablissements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Etablissements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Etablissements.
     */
    distinct?: EtablissementScalarFieldEnum | EtablissementScalarFieldEnum[]
  }

  /**
   * Etablissement findMany
   */
  export type EtablissementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
    /**
     * Filter, which Etablissements to fetch.
     */
    where?: EtablissementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Etablissements to fetch.
     */
    orderBy?: EtablissementOrderByWithRelationInput | EtablissementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Etablissements.
     */
    cursor?: EtablissementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Etablissements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Etablissements.
     */
    skip?: number
    distinct?: EtablissementScalarFieldEnum | EtablissementScalarFieldEnum[]
  }

  /**
   * Etablissement create
   */
  export type EtablissementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
    /**
     * The data needed to create a Etablissement.
     */
    data: XOR<EtablissementCreateInput, EtablissementUncheckedCreateInput>
  }

  /**
   * Etablissement createMany
   */
  export type EtablissementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Etablissements.
     */
    data: EtablissementCreateManyInput | EtablissementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Etablissement createManyAndReturn
   */
  export type EtablissementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * The data used to create many Etablissements.
     */
    data: EtablissementCreateManyInput | EtablissementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Etablissement update
   */
  export type EtablissementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
    /**
     * The data needed to update a Etablissement.
     */
    data: XOR<EtablissementUpdateInput, EtablissementUncheckedUpdateInput>
    /**
     * Choose, which Etablissement to update.
     */
    where: EtablissementWhereUniqueInput
  }

  /**
   * Etablissement updateMany
   */
  export type EtablissementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Etablissements.
     */
    data: XOR<EtablissementUpdateManyMutationInput, EtablissementUncheckedUpdateManyInput>
    /**
     * Filter which Etablissements to update
     */
    where?: EtablissementWhereInput
    /**
     * Limit how many Etablissements to update.
     */
    limit?: number
  }

  /**
   * Etablissement updateManyAndReturn
   */
  export type EtablissementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * The data used to update Etablissements.
     */
    data: XOR<EtablissementUpdateManyMutationInput, EtablissementUncheckedUpdateManyInput>
    /**
     * Filter which Etablissements to update
     */
    where?: EtablissementWhereInput
    /**
     * Limit how many Etablissements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Etablissement upsert
   */
  export type EtablissementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
    /**
     * The filter to search for the Etablissement to update in case it exists.
     */
    where: EtablissementWhereUniqueInput
    /**
     * In case the Etablissement found by the `where` argument doesn't exist, create a new Etablissement with this data.
     */
    create: XOR<EtablissementCreateInput, EtablissementUncheckedCreateInput>
    /**
     * In case the Etablissement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EtablissementUpdateInput, EtablissementUncheckedUpdateInput>
  }

  /**
   * Etablissement delete
   */
  export type EtablissementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
    /**
     * Filter which Etablissement to delete.
     */
    where: EtablissementWhereUniqueInput
  }

  /**
   * Etablissement deleteMany
   */
  export type EtablissementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Etablissements to delete
     */
    where?: EtablissementWhereInput
    /**
     * Limit how many Etablissements to delete.
     */
    limit?: number
  }

  /**
   * Etablissement without action
   */
  export type EtablissementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Etablissement
     */
    select?: EtablissementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Etablissement
     */
    omit?: EtablissementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EtablissementInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    role: 'role',
    email: 'email',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    resetToken: 'resetToken',
    resetTokenExpiry: 'resetTokenExpiry'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const FormateurScalarFieldEnum: {
    id: 'id',
    speciality: 'speciality',
    userId: 'userId'
  };

  export type FormateurScalarFieldEnum = (typeof FormateurScalarFieldEnum)[keyof typeof FormateurScalarFieldEnum]


  export const EtudiantScalarFieldEnum: {
    id: 'id',
    NameEtablissement: 'NameEtablissement',
    userId: 'userId'
  };

  export type EtudiantScalarFieldEnum = (typeof EtudiantScalarFieldEnum)[keyof typeof EtudiantScalarFieldEnum]


  export const CreateurDeFormationScalarFieldEnum: {
    id: 'id',
    userId: 'userId'
  };

  export type CreateurDeFormationScalarFieldEnum = (typeof CreateurDeFormationScalarFieldEnum)[keyof typeof CreateurDeFormationScalarFieldEnum]


  export const AdminScalarFieldEnum: {
    id: 'id',
    userId: 'userId'
  };

  export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum]


  export const EtablissementScalarFieldEnum: {
    id: 'id',
    userId: 'userId'
  };

  export type EtablissementScalarFieldEnum = (typeof EtablissementScalarFieldEnum)[keyof typeof EtablissementScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    role?: EnumRoleFilter<"User"> | $Enums.Role
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    resetToken?: StringFilter<"User"> | string
    resetTokenExpiry?: DateTimeFilter<"User"> | Date | string
    formateurs?: FormateurListRelationFilter
    Etudiants?: EtudiantListRelationFilter
    CreateursDeFormations?: CreateurDeFormationListRelationFilter
    Admins?: AdminListRelationFilter
    Etablissements?: EtablissementListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
    formateurs?: FormateurOrderByRelationAggregateInput
    Etudiants?: EtudiantOrderByRelationAggregateInput
    CreateursDeFormations?: CreateurDeFormationOrderByRelationAggregateInput
    Admins?: AdminOrderByRelationAggregateInput
    Etablissements?: EtablissementOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    role?: EnumRoleFilter<"User"> | $Enums.Role
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    resetToken?: StringFilter<"User"> | string
    resetTokenExpiry?: DateTimeFilter<"User"> | Date | string
    formateurs?: FormateurListRelationFilter
    Etudiants?: EtudiantListRelationFilter
    CreateursDeFormations?: CreateurDeFormationListRelationFilter
    Admins?: AdminListRelationFilter
    Etablissements?: EtablissementListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    resetToken?: StringWithAggregatesFilter<"User"> | string
    resetTokenExpiry?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type FormateurWhereInput = {
    AND?: FormateurWhereInput | FormateurWhereInput[]
    OR?: FormateurWhereInput[]
    NOT?: FormateurWhereInput | FormateurWhereInput[]
    id?: IntFilter<"Formateur"> | number
    speciality?: StringFilter<"Formateur"> | string
    userId?: IntFilter<"Formateur"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FormateurOrderByWithRelationInput = {
    id?: SortOrder
    speciality?: SortOrder
    userId?: SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type FormateurWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FormateurWhereInput | FormateurWhereInput[]
    OR?: FormateurWhereInput[]
    NOT?: FormateurWhereInput | FormateurWhereInput[]
    speciality?: StringFilter<"Formateur"> | string
    userId?: IntFilter<"Formateur"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type FormateurOrderByWithAggregationInput = {
    id?: SortOrder
    speciality?: SortOrder
    userId?: SortOrder
    _count?: FormateurCountOrderByAggregateInput
    _avg?: FormateurAvgOrderByAggregateInput
    _max?: FormateurMaxOrderByAggregateInput
    _min?: FormateurMinOrderByAggregateInput
    _sum?: FormateurSumOrderByAggregateInput
  }

  export type FormateurScalarWhereWithAggregatesInput = {
    AND?: FormateurScalarWhereWithAggregatesInput | FormateurScalarWhereWithAggregatesInput[]
    OR?: FormateurScalarWhereWithAggregatesInput[]
    NOT?: FormateurScalarWhereWithAggregatesInput | FormateurScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Formateur"> | number
    speciality?: StringWithAggregatesFilter<"Formateur"> | string
    userId?: IntWithAggregatesFilter<"Formateur"> | number
  }

  export type EtudiantWhereInput = {
    AND?: EtudiantWhereInput | EtudiantWhereInput[]
    OR?: EtudiantWhereInput[]
    NOT?: EtudiantWhereInput | EtudiantWhereInput[]
    id?: IntFilter<"Etudiant"> | number
    NameEtablissement?: StringFilter<"Etudiant"> | string
    userId?: IntFilter<"Etudiant"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type EtudiantOrderByWithRelationInput = {
    id?: SortOrder
    NameEtablissement?: SortOrder
    userId?: SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type EtudiantWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EtudiantWhereInput | EtudiantWhereInput[]
    OR?: EtudiantWhereInput[]
    NOT?: EtudiantWhereInput | EtudiantWhereInput[]
    NameEtablissement?: StringFilter<"Etudiant"> | string
    userId?: IntFilter<"Etudiant"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type EtudiantOrderByWithAggregationInput = {
    id?: SortOrder
    NameEtablissement?: SortOrder
    userId?: SortOrder
    _count?: EtudiantCountOrderByAggregateInput
    _avg?: EtudiantAvgOrderByAggregateInput
    _max?: EtudiantMaxOrderByAggregateInput
    _min?: EtudiantMinOrderByAggregateInput
    _sum?: EtudiantSumOrderByAggregateInput
  }

  export type EtudiantScalarWhereWithAggregatesInput = {
    AND?: EtudiantScalarWhereWithAggregatesInput | EtudiantScalarWhereWithAggregatesInput[]
    OR?: EtudiantScalarWhereWithAggregatesInput[]
    NOT?: EtudiantScalarWhereWithAggregatesInput | EtudiantScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Etudiant"> | number
    NameEtablissement?: StringWithAggregatesFilter<"Etudiant"> | string
    userId?: IntWithAggregatesFilter<"Etudiant"> | number
  }

  export type CreateurDeFormationWhereInput = {
    AND?: CreateurDeFormationWhereInput | CreateurDeFormationWhereInput[]
    OR?: CreateurDeFormationWhereInput[]
    NOT?: CreateurDeFormationWhereInput | CreateurDeFormationWhereInput[]
    id?: IntFilter<"CreateurDeFormation"> | number
    userId?: IntFilter<"CreateurDeFormation"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CreateurDeFormationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type CreateurDeFormationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CreateurDeFormationWhereInput | CreateurDeFormationWhereInput[]
    OR?: CreateurDeFormationWhereInput[]
    NOT?: CreateurDeFormationWhereInput | CreateurDeFormationWhereInput[]
    userId?: IntFilter<"CreateurDeFormation"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type CreateurDeFormationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    _count?: CreateurDeFormationCountOrderByAggregateInput
    _avg?: CreateurDeFormationAvgOrderByAggregateInput
    _max?: CreateurDeFormationMaxOrderByAggregateInput
    _min?: CreateurDeFormationMinOrderByAggregateInput
    _sum?: CreateurDeFormationSumOrderByAggregateInput
  }

  export type CreateurDeFormationScalarWhereWithAggregatesInput = {
    AND?: CreateurDeFormationScalarWhereWithAggregatesInput | CreateurDeFormationScalarWhereWithAggregatesInput[]
    OR?: CreateurDeFormationScalarWhereWithAggregatesInput[]
    NOT?: CreateurDeFormationScalarWhereWithAggregatesInput | CreateurDeFormationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CreateurDeFormation"> | number
    userId?: IntWithAggregatesFilter<"CreateurDeFormation"> | number
  }

  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    id?: IntFilter<"Admin"> | number
    userId?: IntFilter<"Admin"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AdminOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type AdminWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    userId?: IntFilter<"Admin"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AdminOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    _count?: AdminCountOrderByAggregateInput
    _avg?: AdminAvgOrderByAggregateInput
    _max?: AdminMaxOrderByAggregateInput
    _min?: AdminMinOrderByAggregateInput
    _sum?: AdminSumOrderByAggregateInput
  }

  export type AdminScalarWhereWithAggregatesInput = {
    AND?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    OR?: AdminScalarWhereWithAggregatesInput[]
    NOT?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Admin"> | number
    userId?: IntWithAggregatesFilter<"Admin"> | number
  }

  export type EtablissementWhereInput = {
    AND?: EtablissementWhereInput | EtablissementWhereInput[]
    OR?: EtablissementWhereInput[]
    NOT?: EtablissementWhereInput | EtablissementWhereInput[]
    id?: IntFilter<"Etablissement"> | number
    userId?: IntFilter<"Etablissement"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type EtablissementOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type EtablissementWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EtablissementWhereInput | EtablissementWhereInput[]
    OR?: EtablissementWhereInput[]
    NOT?: EtablissementWhereInput | EtablissementWhereInput[]
    userId?: IntFilter<"Etablissement"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type EtablissementOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    _count?: EtablissementCountOrderByAggregateInput
    _avg?: EtablissementAvgOrderByAggregateInput
    _max?: EtablissementMaxOrderByAggregateInput
    _min?: EtablissementMinOrderByAggregateInput
    _sum?: EtablissementSumOrderByAggregateInput
  }

  export type EtablissementScalarWhereWithAggregatesInput = {
    AND?: EtablissementScalarWhereWithAggregatesInput | EtablissementScalarWhereWithAggregatesInput[]
    OR?: EtablissementScalarWhereWithAggregatesInput[]
    NOT?: EtablissementScalarWhereWithAggregatesInput | EtablissementScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Etablissement"> | number
    userId?: IntWithAggregatesFilter<"Etablissement"> | number
  }

  export type UserCreateInput = {
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    formateurs?: FormateurCreateNestedManyWithoutUserInput
    Etudiants?: EtudiantCreateNestedManyWithoutUserInput
    CreateursDeFormations?: CreateurDeFormationCreateNestedManyWithoutUserInput
    Admins?: AdminCreateNestedManyWithoutUserInput
    Etablissements?: EtablissementCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    formateurs?: FormateurUncheckedCreateNestedManyWithoutUserInput
    Etudiants?: EtudiantUncheckedCreateNestedManyWithoutUserInput
    CreateursDeFormations?: CreateurDeFormationUncheckedCreateNestedManyWithoutUserInput
    Admins?: AdminUncheckedCreateNestedManyWithoutUserInput
    Etablissements?: EtablissementUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    formateurs?: FormateurUpdateManyWithoutUserNestedInput
    Etudiants?: EtudiantUpdateManyWithoutUserNestedInput
    CreateursDeFormations?: CreateurDeFormationUpdateManyWithoutUserNestedInput
    Admins?: AdminUpdateManyWithoutUserNestedInput
    Etablissements?: EtablissementUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    formateurs?: FormateurUncheckedUpdateManyWithoutUserNestedInput
    Etudiants?: EtudiantUncheckedUpdateManyWithoutUserNestedInput
    CreateursDeFormations?: CreateurDeFormationUncheckedUpdateManyWithoutUserNestedInput
    Admins?: AdminUncheckedUpdateManyWithoutUserNestedInput
    Etablissements?: EtablissementUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
  }

  export type UserUpdateManyMutationInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormateurCreateInput = {
    speciality: string
    User: UserCreateNestedOneWithoutFormateursInput
  }

  export type FormateurUncheckedCreateInput = {
    id?: number
    speciality: string
    userId: number
  }

  export type FormateurUpdateInput = {
    speciality?: StringFieldUpdateOperationsInput | string
    User?: UserUpdateOneRequiredWithoutFormateursNestedInput
  }

  export type FormateurUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    speciality?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type FormateurCreateManyInput = {
    id?: number
    speciality: string
    userId: number
  }

  export type FormateurUpdateManyMutationInput = {
    speciality?: StringFieldUpdateOperationsInput | string
  }

  export type FormateurUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    speciality?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type EtudiantCreateInput = {
    NameEtablissement: string
    User: UserCreateNestedOneWithoutEtudiantsInput
  }

  export type EtudiantUncheckedCreateInput = {
    id?: number
    NameEtablissement: string
    userId: number
  }

  export type EtudiantUpdateInput = {
    NameEtablissement?: StringFieldUpdateOperationsInput | string
    User?: UserUpdateOneRequiredWithoutEtudiantsNestedInput
  }

  export type EtudiantUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    NameEtablissement?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type EtudiantCreateManyInput = {
    id?: number
    NameEtablissement: string
    userId: number
  }

  export type EtudiantUpdateManyMutationInput = {
    NameEtablissement?: StringFieldUpdateOperationsInput | string
  }

  export type EtudiantUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    NameEtablissement?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type CreateurDeFormationCreateInput = {
    User: UserCreateNestedOneWithoutCreateursDeFormationsInput
  }

  export type CreateurDeFormationUncheckedCreateInput = {
    id?: number
    userId: number
  }

  export type CreateurDeFormationUpdateInput = {
    User?: UserUpdateOneRequiredWithoutCreateursDeFormationsNestedInput
  }

  export type CreateurDeFormationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type CreateurDeFormationCreateManyInput = {
    id?: number
    userId: number
  }

  export type CreateurDeFormationUpdateManyMutationInput = {

  }

  export type CreateurDeFormationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type AdminCreateInput = {
    User: UserCreateNestedOneWithoutAdminsInput
  }

  export type AdminUncheckedCreateInput = {
    id?: number
    userId: number
  }

  export type AdminUpdateInput = {
    User?: UserUpdateOneRequiredWithoutAdminsNestedInput
  }

  export type AdminUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type AdminCreateManyInput = {
    id?: number
    userId: number
  }

  export type AdminUpdateManyMutationInput = {

  }

  export type AdminUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type EtablissementCreateInput = {
    User: UserCreateNestedOneWithoutEtablissementsInput
  }

  export type EtablissementUncheckedCreateInput = {
    id?: number
    userId: number
  }

  export type EtablissementUpdateInput = {
    User?: UserUpdateOneRequiredWithoutEtablissementsNestedInput
  }

  export type EtablissementUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type EtablissementCreateManyInput = {
    id?: number
    userId: number
  }

  export type EtablissementUpdateManyMutationInput = {

  }

  export type EtablissementUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type FormateurListRelationFilter = {
    every?: FormateurWhereInput
    some?: FormateurWhereInput
    none?: FormateurWhereInput
  }

  export type EtudiantListRelationFilter = {
    every?: EtudiantWhereInput
    some?: EtudiantWhereInput
    none?: EtudiantWhereInput
  }

  export type CreateurDeFormationListRelationFilter = {
    every?: CreateurDeFormationWhereInput
    some?: CreateurDeFormationWhereInput
    none?: CreateurDeFormationWhereInput
  }

  export type AdminListRelationFilter = {
    every?: AdminWhereInput
    some?: AdminWhereInput
    none?: AdminWhereInput
  }

  export type EtablissementListRelationFilter = {
    every?: EtablissementWhereInput
    some?: EtablissementWhereInput
    none?: EtablissementWhereInput
  }

  export type FormateurOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EtudiantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CreateurDeFormationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AdminOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EtablissementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FormateurCountOrderByAggregateInput = {
    id?: SortOrder
    speciality?: SortOrder
    userId?: SortOrder
  }

  export type FormateurAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type FormateurMaxOrderByAggregateInput = {
    id?: SortOrder
    speciality?: SortOrder
    userId?: SortOrder
  }

  export type FormateurMinOrderByAggregateInput = {
    id?: SortOrder
    speciality?: SortOrder
    userId?: SortOrder
  }

  export type FormateurSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type EtudiantCountOrderByAggregateInput = {
    id?: SortOrder
    NameEtablissement?: SortOrder
    userId?: SortOrder
  }

  export type EtudiantAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type EtudiantMaxOrderByAggregateInput = {
    id?: SortOrder
    NameEtablissement?: SortOrder
    userId?: SortOrder
  }

  export type EtudiantMinOrderByAggregateInput = {
    id?: SortOrder
    NameEtablissement?: SortOrder
    userId?: SortOrder
  }

  export type EtudiantSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type CreateurDeFormationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type CreateurDeFormationAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type CreateurDeFormationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type CreateurDeFormationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type CreateurDeFormationSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type AdminCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type AdminAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type AdminMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type AdminMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type AdminSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type EtablissementCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type EtablissementAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type EtablissementMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type EtablissementMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type EtablissementSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type FormateurCreateNestedManyWithoutUserInput = {
    create?: XOR<FormateurCreateWithoutUserInput, FormateurUncheckedCreateWithoutUserInput> | FormateurCreateWithoutUserInput[] | FormateurUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FormateurCreateOrConnectWithoutUserInput | FormateurCreateOrConnectWithoutUserInput[]
    createMany?: FormateurCreateManyUserInputEnvelope
    connect?: FormateurWhereUniqueInput | FormateurWhereUniqueInput[]
  }

  export type EtudiantCreateNestedManyWithoutUserInput = {
    create?: XOR<EtudiantCreateWithoutUserInput, EtudiantUncheckedCreateWithoutUserInput> | EtudiantCreateWithoutUserInput[] | EtudiantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EtudiantCreateOrConnectWithoutUserInput | EtudiantCreateOrConnectWithoutUserInput[]
    createMany?: EtudiantCreateManyUserInputEnvelope
    connect?: EtudiantWhereUniqueInput | EtudiantWhereUniqueInput[]
  }

  export type CreateurDeFormationCreateNestedManyWithoutUserInput = {
    create?: XOR<CreateurDeFormationCreateWithoutUserInput, CreateurDeFormationUncheckedCreateWithoutUserInput> | CreateurDeFormationCreateWithoutUserInput[] | CreateurDeFormationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CreateurDeFormationCreateOrConnectWithoutUserInput | CreateurDeFormationCreateOrConnectWithoutUserInput[]
    createMany?: CreateurDeFormationCreateManyUserInputEnvelope
    connect?: CreateurDeFormationWhereUniqueInput | CreateurDeFormationWhereUniqueInput[]
  }

  export type AdminCreateNestedManyWithoutUserInput = {
    create?: XOR<AdminCreateWithoutUserInput, AdminUncheckedCreateWithoutUserInput> | AdminCreateWithoutUserInput[] | AdminUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AdminCreateOrConnectWithoutUserInput | AdminCreateOrConnectWithoutUserInput[]
    createMany?: AdminCreateManyUserInputEnvelope
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
  }

  export type EtablissementCreateNestedManyWithoutUserInput = {
    create?: XOR<EtablissementCreateWithoutUserInput, EtablissementUncheckedCreateWithoutUserInput> | EtablissementCreateWithoutUserInput[] | EtablissementUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EtablissementCreateOrConnectWithoutUserInput | EtablissementCreateOrConnectWithoutUserInput[]
    createMany?: EtablissementCreateManyUserInputEnvelope
    connect?: EtablissementWhereUniqueInput | EtablissementWhereUniqueInput[]
  }

  export type FormateurUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FormateurCreateWithoutUserInput, FormateurUncheckedCreateWithoutUserInput> | FormateurCreateWithoutUserInput[] | FormateurUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FormateurCreateOrConnectWithoutUserInput | FormateurCreateOrConnectWithoutUserInput[]
    createMany?: FormateurCreateManyUserInputEnvelope
    connect?: FormateurWhereUniqueInput | FormateurWhereUniqueInput[]
  }

  export type EtudiantUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EtudiantCreateWithoutUserInput, EtudiantUncheckedCreateWithoutUserInput> | EtudiantCreateWithoutUserInput[] | EtudiantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EtudiantCreateOrConnectWithoutUserInput | EtudiantCreateOrConnectWithoutUserInput[]
    createMany?: EtudiantCreateManyUserInputEnvelope
    connect?: EtudiantWhereUniqueInput | EtudiantWhereUniqueInput[]
  }

  export type CreateurDeFormationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CreateurDeFormationCreateWithoutUserInput, CreateurDeFormationUncheckedCreateWithoutUserInput> | CreateurDeFormationCreateWithoutUserInput[] | CreateurDeFormationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CreateurDeFormationCreateOrConnectWithoutUserInput | CreateurDeFormationCreateOrConnectWithoutUserInput[]
    createMany?: CreateurDeFormationCreateManyUserInputEnvelope
    connect?: CreateurDeFormationWhereUniqueInput | CreateurDeFormationWhereUniqueInput[]
  }

  export type AdminUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AdminCreateWithoutUserInput, AdminUncheckedCreateWithoutUserInput> | AdminCreateWithoutUserInput[] | AdminUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AdminCreateOrConnectWithoutUserInput | AdminCreateOrConnectWithoutUserInput[]
    createMany?: AdminCreateManyUserInputEnvelope
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
  }

  export type EtablissementUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EtablissementCreateWithoutUserInput, EtablissementUncheckedCreateWithoutUserInput> | EtablissementCreateWithoutUserInput[] | EtablissementUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EtablissementCreateOrConnectWithoutUserInput | EtablissementCreateOrConnectWithoutUserInput[]
    createMany?: EtablissementCreateManyUserInputEnvelope
    connect?: EtablissementWhereUniqueInput | EtablissementWhereUniqueInput[]
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type FormateurUpdateManyWithoutUserNestedInput = {
    create?: XOR<FormateurCreateWithoutUserInput, FormateurUncheckedCreateWithoutUserInput> | FormateurCreateWithoutUserInput[] | FormateurUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FormateurCreateOrConnectWithoutUserInput | FormateurCreateOrConnectWithoutUserInput[]
    upsert?: FormateurUpsertWithWhereUniqueWithoutUserInput | FormateurUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FormateurCreateManyUserInputEnvelope
    set?: FormateurWhereUniqueInput | FormateurWhereUniqueInput[]
    disconnect?: FormateurWhereUniqueInput | FormateurWhereUniqueInput[]
    delete?: FormateurWhereUniqueInput | FormateurWhereUniqueInput[]
    connect?: FormateurWhereUniqueInput | FormateurWhereUniqueInput[]
    update?: FormateurUpdateWithWhereUniqueWithoutUserInput | FormateurUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FormateurUpdateManyWithWhereWithoutUserInput | FormateurUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FormateurScalarWhereInput | FormateurScalarWhereInput[]
  }

  export type EtudiantUpdateManyWithoutUserNestedInput = {
    create?: XOR<EtudiantCreateWithoutUserInput, EtudiantUncheckedCreateWithoutUserInput> | EtudiantCreateWithoutUserInput[] | EtudiantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EtudiantCreateOrConnectWithoutUserInput | EtudiantCreateOrConnectWithoutUserInput[]
    upsert?: EtudiantUpsertWithWhereUniqueWithoutUserInput | EtudiantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EtudiantCreateManyUserInputEnvelope
    set?: EtudiantWhereUniqueInput | EtudiantWhereUniqueInput[]
    disconnect?: EtudiantWhereUniqueInput | EtudiantWhereUniqueInput[]
    delete?: EtudiantWhereUniqueInput | EtudiantWhereUniqueInput[]
    connect?: EtudiantWhereUniqueInput | EtudiantWhereUniqueInput[]
    update?: EtudiantUpdateWithWhereUniqueWithoutUserInput | EtudiantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EtudiantUpdateManyWithWhereWithoutUserInput | EtudiantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EtudiantScalarWhereInput | EtudiantScalarWhereInput[]
  }

  export type CreateurDeFormationUpdateManyWithoutUserNestedInput = {
    create?: XOR<CreateurDeFormationCreateWithoutUserInput, CreateurDeFormationUncheckedCreateWithoutUserInput> | CreateurDeFormationCreateWithoutUserInput[] | CreateurDeFormationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CreateurDeFormationCreateOrConnectWithoutUserInput | CreateurDeFormationCreateOrConnectWithoutUserInput[]
    upsert?: CreateurDeFormationUpsertWithWhereUniqueWithoutUserInput | CreateurDeFormationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CreateurDeFormationCreateManyUserInputEnvelope
    set?: CreateurDeFormationWhereUniqueInput | CreateurDeFormationWhereUniqueInput[]
    disconnect?: CreateurDeFormationWhereUniqueInput | CreateurDeFormationWhereUniqueInput[]
    delete?: CreateurDeFormationWhereUniqueInput | CreateurDeFormationWhereUniqueInput[]
    connect?: CreateurDeFormationWhereUniqueInput | CreateurDeFormationWhereUniqueInput[]
    update?: CreateurDeFormationUpdateWithWhereUniqueWithoutUserInput | CreateurDeFormationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CreateurDeFormationUpdateManyWithWhereWithoutUserInput | CreateurDeFormationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CreateurDeFormationScalarWhereInput | CreateurDeFormationScalarWhereInput[]
  }

  export type AdminUpdateManyWithoutUserNestedInput = {
    create?: XOR<AdminCreateWithoutUserInput, AdminUncheckedCreateWithoutUserInput> | AdminCreateWithoutUserInput[] | AdminUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AdminCreateOrConnectWithoutUserInput | AdminCreateOrConnectWithoutUserInput[]
    upsert?: AdminUpsertWithWhereUniqueWithoutUserInput | AdminUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AdminCreateManyUserInputEnvelope
    set?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    disconnect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    delete?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    update?: AdminUpdateWithWhereUniqueWithoutUserInput | AdminUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AdminUpdateManyWithWhereWithoutUserInput | AdminUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AdminScalarWhereInput | AdminScalarWhereInput[]
  }

  export type EtablissementUpdateManyWithoutUserNestedInput = {
    create?: XOR<EtablissementCreateWithoutUserInput, EtablissementUncheckedCreateWithoutUserInput> | EtablissementCreateWithoutUserInput[] | EtablissementUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EtablissementCreateOrConnectWithoutUserInput | EtablissementCreateOrConnectWithoutUserInput[]
    upsert?: EtablissementUpsertWithWhereUniqueWithoutUserInput | EtablissementUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EtablissementCreateManyUserInputEnvelope
    set?: EtablissementWhereUniqueInput | EtablissementWhereUniqueInput[]
    disconnect?: EtablissementWhereUniqueInput | EtablissementWhereUniqueInput[]
    delete?: EtablissementWhereUniqueInput | EtablissementWhereUniqueInput[]
    connect?: EtablissementWhereUniqueInput | EtablissementWhereUniqueInput[]
    update?: EtablissementUpdateWithWhereUniqueWithoutUserInput | EtablissementUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EtablissementUpdateManyWithWhereWithoutUserInput | EtablissementUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EtablissementScalarWhereInput | EtablissementScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FormateurUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FormateurCreateWithoutUserInput, FormateurUncheckedCreateWithoutUserInput> | FormateurCreateWithoutUserInput[] | FormateurUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FormateurCreateOrConnectWithoutUserInput | FormateurCreateOrConnectWithoutUserInput[]
    upsert?: FormateurUpsertWithWhereUniqueWithoutUserInput | FormateurUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FormateurCreateManyUserInputEnvelope
    set?: FormateurWhereUniqueInput | FormateurWhereUniqueInput[]
    disconnect?: FormateurWhereUniqueInput | FormateurWhereUniqueInput[]
    delete?: FormateurWhereUniqueInput | FormateurWhereUniqueInput[]
    connect?: FormateurWhereUniqueInput | FormateurWhereUniqueInput[]
    update?: FormateurUpdateWithWhereUniqueWithoutUserInput | FormateurUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FormateurUpdateManyWithWhereWithoutUserInput | FormateurUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FormateurScalarWhereInput | FormateurScalarWhereInput[]
  }

  export type EtudiantUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EtudiantCreateWithoutUserInput, EtudiantUncheckedCreateWithoutUserInput> | EtudiantCreateWithoutUserInput[] | EtudiantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EtudiantCreateOrConnectWithoutUserInput | EtudiantCreateOrConnectWithoutUserInput[]
    upsert?: EtudiantUpsertWithWhereUniqueWithoutUserInput | EtudiantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EtudiantCreateManyUserInputEnvelope
    set?: EtudiantWhereUniqueInput | EtudiantWhereUniqueInput[]
    disconnect?: EtudiantWhereUniqueInput | EtudiantWhereUniqueInput[]
    delete?: EtudiantWhereUniqueInput | EtudiantWhereUniqueInput[]
    connect?: EtudiantWhereUniqueInput | EtudiantWhereUniqueInput[]
    update?: EtudiantUpdateWithWhereUniqueWithoutUserInput | EtudiantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EtudiantUpdateManyWithWhereWithoutUserInput | EtudiantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EtudiantScalarWhereInput | EtudiantScalarWhereInput[]
  }

  export type CreateurDeFormationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CreateurDeFormationCreateWithoutUserInput, CreateurDeFormationUncheckedCreateWithoutUserInput> | CreateurDeFormationCreateWithoutUserInput[] | CreateurDeFormationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CreateurDeFormationCreateOrConnectWithoutUserInput | CreateurDeFormationCreateOrConnectWithoutUserInput[]
    upsert?: CreateurDeFormationUpsertWithWhereUniqueWithoutUserInput | CreateurDeFormationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CreateurDeFormationCreateManyUserInputEnvelope
    set?: CreateurDeFormationWhereUniqueInput | CreateurDeFormationWhereUniqueInput[]
    disconnect?: CreateurDeFormationWhereUniqueInput | CreateurDeFormationWhereUniqueInput[]
    delete?: CreateurDeFormationWhereUniqueInput | CreateurDeFormationWhereUniqueInput[]
    connect?: CreateurDeFormationWhereUniqueInput | CreateurDeFormationWhereUniqueInput[]
    update?: CreateurDeFormationUpdateWithWhereUniqueWithoutUserInput | CreateurDeFormationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CreateurDeFormationUpdateManyWithWhereWithoutUserInput | CreateurDeFormationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CreateurDeFormationScalarWhereInput | CreateurDeFormationScalarWhereInput[]
  }

  export type AdminUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AdminCreateWithoutUserInput, AdminUncheckedCreateWithoutUserInput> | AdminCreateWithoutUserInput[] | AdminUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AdminCreateOrConnectWithoutUserInput | AdminCreateOrConnectWithoutUserInput[]
    upsert?: AdminUpsertWithWhereUniqueWithoutUserInput | AdminUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AdminCreateManyUserInputEnvelope
    set?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    disconnect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    delete?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    update?: AdminUpdateWithWhereUniqueWithoutUserInput | AdminUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AdminUpdateManyWithWhereWithoutUserInput | AdminUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AdminScalarWhereInput | AdminScalarWhereInput[]
  }

  export type EtablissementUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EtablissementCreateWithoutUserInput, EtablissementUncheckedCreateWithoutUserInput> | EtablissementCreateWithoutUserInput[] | EtablissementUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EtablissementCreateOrConnectWithoutUserInput | EtablissementCreateOrConnectWithoutUserInput[]
    upsert?: EtablissementUpsertWithWhereUniqueWithoutUserInput | EtablissementUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EtablissementCreateManyUserInputEnvelope
    set?: EtablissementWhereUniqueInput | EtablissementWhereUniqueInput[]
    disconnect?: EtablissementWhereUniqueInput | EtablissementWhereUniqueInput[]
    delete?: EtablissementWhereUniqueInput | EtablissementWhereUniqueInput[]
    connect?: EtablissementWhereUniqueInput | EtablissementWhereUniqueInput[]
    update?: EtablissementUpdateWithWhereUniqueWithoutUserInput | EtablissementUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EtablissementUpdateManyWithWhereWithoutUserInput | EtablissementUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EtablissementScalarWhereInput | EtablissementScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutFormateursInput = {
    create?: XOR<UserCreateWithoutFormateursInput, UserUncheckedCreateWithoutFormateursInput>
    connectOrCreate?: UserCreateOrConnectWithoutFormateursInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFormateursNestedInput = {
    create?: XOR<UserCreateWithoutFormateursInput, UserUncheckedCreateWithoutFormateursInput>
    connectOrCreate?: UserCreateOrConnectWithoutFormateursInput
    upsert?: UserUpsertWithoutFormateursInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFormateursInput, UserUpdateWithoutFormateursInput>, UserUncheckedUpdateWithoutFormateursInput>
  }

  export type UserCreateNestedOneWithoutEtudiantsInput = {
    create?: XOR<UserCreateWithoutEtudiantsInput, UserUncheckedCreateWithoutEtudiantsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEtudiantsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutEtudiantsNestedInput = {
    create?: XOR<UserCreateWithoutEtudiantsInput, UserUncheckedCreateWithoutEtudiantsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEtudiantsInput
    upsert?: UserUpsertWithoutEtudiantsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEtudiantsInput, UserUpdateWithoutEtudiantsInput>, UserUncheckedUpdateWithoutEtudiantsInput>
  }

  export type UserCreateNestedOneWithoutCreateursDeFormationsInput = {
    create?: XOR<UserCreateWithoutCreateursDeFormationsInput, UserUncheckedCreateWithoutCreateursDeFormationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreateursDeFormationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCreateursDeFormationsNestedInput = {
    create?: XOR<UserCreateWithoutCreateursDeFormationsInput, UserUncheckedCreateWithoutCreateursDeFormationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreateursDeFormationsInput
    upsert?: UserUpsertWithoutCreateursDeFormationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreateursDeFormationsInput, UserUpdateWithoutCreateursDeFormationsInput>, UserUncheckedUpdateWithoutCreateursDeFormationsInput>
  }

  export type UserCreateNestedOneWithoutAdminsInput = {
    create?: XOR<UserCreateWithoutAdminsInput, UserUncheckedCreateWithoutAdminsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdminsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAdminsNestedInput = {
    create?: XOR<UserCreateWithoutAdminsInput, UserUncheckedCreateWithoutAdminsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdminsInput
    upsert?: UserUpsertWithoutAdminsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAdminsInput, UserUpdateWithoutAdminsInput>, UserUncheckedUpdateWithoutAdminsInput>
  }

  export type UserCreateNestedOneWithoutEtablissementsInput = {
    create?: XOR<UserCreateWithoutEtablissementsInput, UserUncheckedCreateWithoutEtablissementsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEtablissementsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutEtablissementsNestedInput = {
    create?: XOR<UserCreateWithoutEtablissementsInput, UserUncheckedCreateWithoutEtablissementsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEtablissementsInput
    upsert?: UserUpsertWithoutEtablissementsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEtablissementsInput, UserUpdateWithoutEtablissementsInput>, UserUncheckedUpdateWithoutEtablissementsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FormateurCreateWithoutUserInput = {
    speciality: string
  }

  export type FormateurUncheckedCreateWithoutUserInput = {
    id?: number
    speciality: string
  }

  export type FormateurCreateOrConnectWithoutUserInput = {
    where: FormateurWhereUniqueInput
    create: XOR<FormateurCreateWithoutUserInput, FormateurUncheckedCreateWithoutUserInput>
  }

  export type FormateurCreateManyUserInputEnvelope = {
    data: FormateurCreateManyUserInput | FormateurCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EtudiantCreateWithoutUserInput = {
    NameEtablissement: string
  }

  export type EtudiantUncheckedCreateWithoutUserInput = {
    id?: number
    NameEtablissement: string
  }

  export type EtudiantCreateOrConnectWithoutUserInput = {
    where: EtudiantWhereUniqueInput
    create: XOR<EtudiantCreateWithoutUserInput, EtudiantUncheckedCreateWithoutUserInput>
  }

  export type EtudiantCreateManyUserInputEnvelope = {
    data: EtudiantCreateManyUserInput | EtudiantCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CreateurDeFormationCreateWithoutUserInput = {

  }

  export type CreateurDeFormationUncheckedCreateWithoutUserInput = {
    id?: number
  }

  export type CreateurDeFormationCreateOrConnectWithoutUserInput = {
    where: CreateurDeFormationWhereUniqueInput
    create: XOR<CreateurDeFormationCreateWithoutUserInput, CreateurDeFormationUncheckedCreateWithoutUserInput>
  }

  export type CreateurDeFormationCreateManyUserInputEnvelope = {
    data: CreateurDeFormationCreateManyUserInput | CreateurDeFormationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AdminCreateWithoutUserInput = {

  }

  export type AdminUncheckedCreateWithoutUserInput = {
    id?: number
  }

  export type AdminCreateOrConnectWithoutUserInput = {
    where: AdminWhereUniqueInput
    create: XOR<AdminCreateWithoutUserInput, AdminUncheckedCreateWithoutUserInput>
  }

  export type AdminCreateManyUserInputEnvelope = {
    data: AdminCreateManyUserInput | AdminCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EtablissementCreateWithoutUserInput = {

  }

  export type EtablissementUncheckedCreateWithoutUserInput = {
    id?: number
  }

  export type EtablissementCreateOrConnectWithoutUserInput = {
    where: EtablissementWhereUniqueInput
    create: XOR<EtablissementCreateWithoutUserInput, EtablissementUncheckedCreateWithoutUserInput>
  }

  export type EtablissementCreateManyUserInputEnvelope = {
    data: EtablissementCreateManyUserInput | EtablissementCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FormateurUpsertWithWhereUniqueWithoutUserInput = {
    where: FormateurWhereUniqueInput
    update: XOR<FormateurUpdateWithoutUserInput, FormateurUncheckedUpdateWithoutUserInput>
    create: XOR<FormateurCreateWithoutUserInput, FormateurUncheckedCreateWithoutUserInput>
  }

  export type FormateurUpdateWithWhereUniqueWithoutUserInput = {
    where: FormateurWhereUniqueInput
    data: XOR<FormateurUpdateWithoutUserInput, FormateurUncheckedUpdateWithoutUserInput>
  }

  export type FormateurUpdateManyWithWhereWithoutUserInput = {
    where: FormateurScalarWhereInput
    data: XOR<FormateurUpdateManyMutationInput, FormateurUncheckedUpdateManyWithoutUserInput>
  }

  export type FormateurScalarWhereInput = {
    AND?: FormateurScalarWhereInput | FormateurScalarWhereInput[]
    OR?: FormateurScalarWhereInput[]
    NOT?: FormateurScalarWhereInput | FormateurScalarWhereInput[]
    id?: IntFilter<"Formateur"> | number
    speciality?: StringFilter<"Formateur"> | string
    userId?: IntFilter<"Formateur"> | number
  }

  export type EtudiantUpsertWithWhereUniqueWithoutUserInput = {
    where: EtudiantWhereUniqueInput
    update: XOR<EtudiantUpdateWithoutUserInput, EtudiantUncheckedUpdateWithoutUserInput>
    create: XOR<EtudiantCreateWithoutUserInput, EtudiantUncheckedCreateWithoutUserInput>
  }

  export type EtudiantUpdateWithWhereUniqueWithoutUserInput = {
    where: EtudiantWhereUniqueInput
    data: XOR<EtudiantUpdateWithoutUserInput, EtudiantUncheckedUpdateWithoutUserInput>
  }

  export type EtudiantUpdateManyWithWhereWithoutUserInput = {
    where: EtudiantScalarWhereInput
    data: XOR<EtudiantUpdateManyMutationInput, EtudiantUncheckedUpdateManyWithoutUserInput>
  }

  export type EtudiantScalarWhereInput = {
    AND?: EtudiantScalarWhereInput | EtudiantScalarWhereInput[]
    OR?: EtudiantScalarWhereInput[]
    NOT?: EtudiantScalarWhereInput | EtudiantScalarWhereInput[]
    id?: IntFilter<"Etudiant"> | number
    NameEtablissement?: StringFilter<"Etudiant"> | string
    userId?: IntFilter<"Etudiant"> | number
  }

  export type CreateurDeFormationUpsertWithWhereUniqueWithoutUserInput = {
    where: CreateurDeFormationWhereUniqueInput
    update: XOR<CreateurDeFormationUpdateWithoutUserInput, CreateurDeFormationUncheckedUpdateWithoutUserInput>
    create: XOR<CreateurDeFormationCreateWithoutUserInput, CreateurDeFormationUncheckedCreateWithoutUserInput>
  }

  export type CreateurDeFormationUpdateWithWhereUniqueWithoutUserInput = {
    where: CreateurDeFormationWhereUniqueInput
    data: XOR<CreateurDeFormationUpdateWithoutUserInput, CreateurDeFormationUncheckedUpdateWithoutUserInput>
  }

  export type CreateurDeFormationUpdateManyWithWhereWithoutUserInput = {
    where: CreateurDeFormationScalarWhereInput
    data: XOR<CreateurDeFormationUpdateManyMutationInput, CreateurDeFormationUncheckedUpdateManyWithoutUserInput>
  }

  export type CreateurDeFormationScalarWhereInput = {
    AND?: CreateurDeFormationScalarWhereInput | CreateurDeFormationScalarWhereInput[]
    OR?: CreateurDeFormationScalarWhereInput[]
    NOT?: CreateurDeFormationScalarWhereInput | CreateurDeFormationScalarWhereInput[]
    id?: IntFilter<"CreateurDeFormation"> | number
    userId?: IntFilter<"CreateurDeFormation"> | number
  }

  export type AdminUpsertWithWhereUniqueWithoutUserInput = {
    where: AdminWhereUniqueInput
    update: XOR<AdminUpdateWithoutUserInput, AdminUncheckedUpdateWithoutUserInput>
    create: XOR<AdminCreateWithoutUserInput, AdminUncheckedCreateWithoutUserInput>
  }

  export type AdminUpdateWithWhereUniqueWithoutUserInput = {
    where: AdminWhereUniqueInput
    data: XOR<AdminUpdateWithoutUserInput, AdminUncheckedUpdateWithoutUserInput>
  }

  export type AdminUpdateManyWithWhereWithoutUserInput = {
    where: AdminScalarWhereInput
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyWithoutUserInput>
  }

  export type AdminScalarWhereInput = {
    AND?: AdminScalarWhereInput | AdminScalarWhereInput[]
    OR?: AdminScalarWhereInput[]
    NOT?: AdminScalarWhereInput | AdminScalarWhereInput[]
    id?: IntFilter<"Admin"> | number
    userId?: IntFilter<"Admin"> | number
  }

  export type EtablissementUpsertWithWhereUniqueWithoutUserInput = {
    where: EtablissementWhereUniqueInput
    update: XOR<EtablissementUpdateWithoutUserInput, EtablissementUncheckedUpdateWithoutUserInput>
    create: XOR<EtablissementCreateWithoutUserInput, EtablissementUncheckedCreateWithoutUserInput>
  }

  export type EtablissementUpdateWithWhereUniqueWithoutUserInput = {
    where: EtablissementWhereUniqueInput
    data: XOR<EtablissementUpdateWithoutUserInput, EtablissementUncheckedUpdateWithoutUserInput>
  }

  export type EtablissementUpdateManyWithWhereWithoutUserInput = {
    where: EtablissementScalarWhereInput
    data: XOR<EtablissementUpdateManyMutationInput, EtablissementUncheckedUpdateManyWithoutUserInput>
  }

  export type EtablissementScalarWhereInput = {
    AND?: EtablissementScalarWhereInput | EtablissementScalarWhereInput[]
    OR?: EtablissementScalarWhereInput[]
    NOT?: EtablissementScalarWhereInput | EtablissementScalarWhereInput[]
    id?: IntFilter<"Etablissement"> | number
    userId?: IntFilter<"Etablissement"> | number
  }

  export type UserCreateWithoutFormateursInput = {
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    Etudiants?: EtudiantCreateNestedManyWithoutUserInput
    CreateursDeFormations?: CreateurDeFormationCreateNestedManyWithoutUserInput
    Admins?: AdminCreateNestedManyWithoutUserInput
    Etablissements?: EtablissementCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFormateursInput = {
    id?: number
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    Etudiants?: EtudiantUncheckedCreateNestedManyWithoutUserInput
    CreateursDeFormations?: CreateurDeFormationUncheckedCreateNestedManyWithoutUserInput
    Admins?: AdminUncheckedCreateNestedManyWithoutUserInput
    Etablissements?: EtablissementUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFormateursInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFormateursInput, UserUncheckedCreateWithoutFormateursInput>
  }

  export type UserUpsertWithoutFormateursInput = {
    update: XOR<UserUpdateWithoutFormateursInput, UserUncheckedUpdateWithoutFormateursInput>
    create: XOR<UserCreateWithoutFormateursInput, UserUncheckedCreateWithoutFormateursInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFormateursInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFormateursInput, UserUncheckedUpdateWithoutFormateursInput>
  }

  export type UserUpdateWithoutFormateursInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    Etudiants?: EtudiantUpdateManyWithoutUserNestedInput
    CreateursDeFormations?: CreateurDeFormationUpdateManyWithoutUserNestedInput
    Admins?: AdminUpdateManyWithoutUserNestedInput
    Etablissements?: EtablissementUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFormateursInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    Etudiants?: EtudiantUncheckedUpdateManyWithoutUserNestedInput
    CreateursDeFormations?: CreateurDeFormationUncheckedUpdateManyWithoutUserNestedInput
    Admins?: AdminUncheckedUpdateManyWithoutUserNestedInput
    Etablissements?: EtablissementUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutEtudiantsInput = {
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    formateurs?: FormateurCreateNestedManyWithoutUserInput
    CreateursDeFormations?: CreateurDeFormationCreateNestedManyWithoutUserInput
    Admins?: AdminCreateNestedManyWithoutUserInput
    Etablissements?: EtablissementCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEtudiantsInput = {
    id?: number
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    formateurs?: FormateurUncheckedCreateNestedManyWithoutUserInput
    CreateursDeFormations?: CreateurDeFormationUncheckedCreateNestedManyWithoutUserInput
    Admins?: AdminUncheckedCreateNestedManyWithoutUserInput
    Etablissements?: EtablissementUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEtudiantsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEtudiantsInput, UserUncheckedCreateWithoutEtudiantsInput>
  }

  export type UserUpsertWithoutEtudiantsInput = {
    update: XOR<UserUpdateWithoutEtudiantsInput, UserUncheckedUpdateWithoutEtudiantsInput>
    create: XOR<UserCreateWithoutEtudiantsInput, UserUncheckedCreateWithoutEtudiantsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEtudiantsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEtudiantsInput, UserUncheckedUpdateWithoutEtudiantsInput>
  }

  export type UserUpdateWithoutEtudiantsInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    formateurs?: FormateurUpdateManyWithoutUserNestedInput
    CreateursDeFormations?: CreateurDeFormationUpdateManyWithoutUserNestedInput
    Admins?: AdminUpdateManyWithoutUserNestedInput
    Etablissements?: EtablissementUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEtudiantsInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    formateurs?: FormateurUncheckedUpdateManyWithoutUserNestedInput
    CreateursDeFormations?: CreateurDeFormationUncheckedUpdateManyWithoutUserNestedInput
    Admins?: AdminUncheckedUpdateManyWithoutUserNestedInput
    Etablissements?: EtablissementUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutCreateursDeFormationsInput = {
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    formateurs?: FormateurCreateNestedManyWithoutUserInput
    Etudiants?: EtudiantCreateNestedManyWithoutUserInput
    Admins?: AdminCreateNestedManyWithoutUserInput
    Etablissements?: EtablissementCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreateursDeFormationsInput = {
    id?: number
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    formateurs?: FormateurUncheckedCreateNestedManyWithoutUserInput
    Etudiants?: EtudiantUncheckedCreateNestedManyWithoutUserInput
    Admins?: AdminUncheckedCreateNestedManyWithoutUserInput
    Etablissements?: EtablissementUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreateursDeFormationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreateursDeFormationsInput, UserUncheckedCreateWithoutCreateursDeFormationsInput>
  }

  export type UserUpsertWithoutCreateursDeFormationsInput = {
    update: XOR<UserUpdateWithoutCreateursDeFormationsInput, UserUncheckedUpdateWithoutCreateursDeFormationsInput>
    create: XOR<UserCreateWithoutCreateursDeFormationsInput, UserUncheckedCreateWithoutCreateursDeFormationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreateursDeFormationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreateursDeFormationsInput, UserUncheckedUpdateWithoutCreateursDeFormationsInput>
  }

  export type UserUpdateWithoutCreateursDeFormationsInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    formateurs?: FormateurUpdateManyWithoutUserNestedInput
    Etudiants?: EtudiantUpdateManyWithoutUserNestedInput
    Admins?: AdminUpdateManyWithoutUserNestedInput
    Etablissements?: EtablissementUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreateursDeFormationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    formateurs?: FormateurUncheckedUpdateManyWithoutUserNestedInput
    Etudiants?: EtudiantUncheckedUpdateManyWithoutUserNestedInput
    Admins?: AdminUncheckedUpdateManyWithoutUserNestedInput
    Etablissements?: EtablissementUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAdminsInput = {
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    formateurs?: FormateurCreateNestedManyWithoutUserInput
    Etudiants?: EtudiantCreateNestedManyWithoutUserInput
    CreateursDeFormations?: CreateurDeFormationCreateNestedManyWithoutUserInput
    Etablissements?: EtablissementCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAdminsInput = {
    id?: number
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    formateurs?: FormateurUncheckedCreateNestedManyWithoutUserInput
    Etudiants?: EtudiantUncheckedCreateNestedManyWithoutUserInput
    CreateursDeFormations?: CreateurDeFormationUncheckedCreateNestedManyWithoutUserInput
    Etablissements?: EtablissementUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAdminsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAdminsInput, UserUncheckedCreateWithoutAdminsInput>
  }

  export type UserUpsertWithoutAdminsInput = {
    update: XOR<UserUpdateWithoutAdminsInput, UserUncheckedUpdateWithoutAdminsInput>
    create: XOR<UserCreateWithoutAdminsInput, UserUncheckedCreateWithoutAdminsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAdminsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAdminsInput, UserUncheckedUpdateWithoutAdminsInput>
  }

  export type UserUpdateWithoutAdminsInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    formateurs?: FormateurUpdateManyWithoutUserNestedInput
    Etudiants?: EtudiantUpdateManyWithoutUserNestedInput
    CreateursDeFormations?: CreateurDeFormationUpdateManyWithoutUserNestedInput
    Etablissements?: EtablissementUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAdminsInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    formateurs?: FormateurUncheckedUpdateManyWithoutUserNestedInput
    Etudiants?: EtudiantUncheckedUpdateManyWithoutUserNestedInput
    CreateursDeFormations?: CreateurDeFormationUncheckedUpdateManyWithoutUserNestedInput
    Etablissements?: EtablissementUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutEtablissementsInput = {
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    formateurs?: FormateurCreateNestedManyWithoutUserInput
    Etudiants?: EtudiantCreateNestedManyWithoutUserInput
    CreateursDeFormations?: CreateurDeFormationCreateNestedManyWithoutUserInput
    Admins?: AdminCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEtablissementsInput = {
    id?: number
    role?: $Enums.Role
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken: string
    resetTokenExpiry: Date | string
    formateurs?: FormateurUncheckedCreateNestedManyWithoutUserInput
    Etudiants?: EtudiantUncheckedCreateNestedManyWithoutUserInput
    CreateursDeFormations?: CreateurDeFormationUncheckedCreateNestedManyWithoutUserInput
    Admins?: AdminUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEtablissementsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEtablissementsInput, UserUncheckedCreateWithoutEtablissementsInput>
  }

  export type UserUpsertWithoutEtablissementsInput = {
    update: XOR<UserUpdateWithoutEtablissementsInput, UserUncheckedUpdateWithoutEtablissementsInput>
    create: XOR<UserCreateWithoutEtablissementsInput, UserUncheckedCreateWithoutEtablissementsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEtablissementsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEtablissementsInput, UserUncheckedUpdateWithoutEtablissementsInput>
  }

  export type UserUpdateWithoutEtablissementsInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    formateurs?: FormateurUpdateManyWithoutUserNestedInput
    Etudiants?: EtudiantUpdateManyWithoutUserNestedInput
    CreateursDeFormations?: CreateurDeFormationUpdateManyWithoutUserNestedInput
    Admins?: AdminUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEtablissementsInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: StringFieldUpdateOperationsInput | string
    resetTokenExpiry?: DateTimeFieldUpdateOperationsInput | Date | string
    formateurs?: FormateurUncheckedUpdateManyWithoutUserNestedInput
    Etudiants?: EtudiantUncheckedUpdateManyWithoutUserNestedInput
    CreateursDeFormations?: CreateurDeFormationUncheckedUpdateManyWithoutUserNestedInput
    Admins?: AdminUncheckedUpdateManyWithoutUserNestedInput
  }

  export type FormateurCreateManyUserInput = {
    id?: number
    speciality: string
  }

  export type EtudiantCreateManyUserInput = {
    id?: number
    NameEtablissement: string
  }

  export type CreateurDeFormationCreateManyUserInput = {
    id?: number
  }

  export type AdminCreateManyUserInput = {
    id?: number
  }

  export type EtablissementCreateManyUserInput = {
    id?: number
  }

  export type FormateurUpdateWithoutUserInput = {
    speciality?: StringFieldUpdateOperationsInput | string
  }

  export type FormateurUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    speciality?: StringFieldUpdateOperationsInput | string
  }

  export type FormateurUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    speciality?: StringFieldUpdateOperationsInput | string
  }

  export type EtudiantUpdateWithoutUserInput = {
    NameEtablissement?: StringFieldUpdateOperationsInput | string
  }

  export type EtudiantUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    NameEtablissement?: StringFieldUpdateOperationsInput | string
  }

  export type EtudiantUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    NameEtablissement?: StringFieldUpdateOperationsInput | string
  }

  export type CreateurDeFormationUpdateWithoutUserInput = {

  }

  export type CreateurDeFormationUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
  }

  export type CreateurDeFormationUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
  }

  export type AdminUpdateWithoutUserInput = {

  }

  export type AdminUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
  }

  export type AdminUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
  }

  export type EtablissementUpdateWithoutUserInput = {

  }

  export type EtablissementUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
  }

  export type EtablissementUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}